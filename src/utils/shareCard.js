// Render the current card to a pretty PNG for sharing (WeChat, iMessage, ...).
// Pure canvas — no extra dependencies.

const COLORS = {
  ivory: '#FFF8EB',
  white: '#FFFFFF',
  ink: '#282828',
  gray: '#656565',
  orange: '#ECB68C',
  pinkBorder: 'rgba(208, 183, 176, 0.45)',
};

const W = 1080;
const H = 1350;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Word-wrap that handles both English (spaces) and Chinese (per character)
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  const push = () => {
    if (line) lines.push(line);
    line = '';
  };
  const tokens = text.split(/(\s+)/).filter((t) => t.length);
  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      if (line) line += ' ';
      continue;
    }
    if (ctx.measureText(line + token).width <= maxWidth) {
      line += token;
      continue;
    }
    // token doesn't fit after current line
    if (line && ctx.measureText(token).width <= maxWidth) {
      push();
      line = token;
      continue;
    }
    // token itself too long (CJK or very long word): break per character
    for (const ch of token) {
      if (ctx.measureText(line + ch).width > maxWidth) push();
      line += ch;
    }
  }
  push();
  return lines;
}

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function generateCardImage({ question, category, imageUrl, lang }) {
  try {
    await document.fonts.ready;
  } catch {
    /* older browsers */
  }
  const artwork = await loadImage(imageUrl);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = COLORS.ivory;
  ctx.fillRect(0, 0, W, H);

  // Card
  const card = { x: 60, y: 80, w: W - 120, h: H - 220 };
  ctx.save();
  ctx.shadowColor = 'rgba(40,40,40,0.16)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;
  roundRect(ctx, card.x, card.y, card.w, card.h, 48);
  ctx.fillStyle = COLORS.white;
  ctx.fill();
  ctx.restore();
  roundRect(ctx, card.x, card.y, card.w, card.h, 48);
  ctx.strokeStyle = COLORS.pinkBorder;
  ctx.lineWidth = 4;
  ctx.stroke();

  const padX = card.x + 70;
  const contentW = card.w - 140;
  const showEn = lang !== 'zh' && question.en;
  const same = question.en === question.zh;
  const showZh = lang !== 'en' && question.zh && !(showEn && same);

  // Category chip
  const chipText =
    lang === 'en' ? category.en : lang === 'zh' ? category.zh : `${category.en} · ${category.zh}`;
  ctx.font = '34px "Ma Shan Zheng", "Patrick Hand", sans-serif';
  const chipW = ctx.measureText(chipText).width + 64;
  roundRect(ctx, padX, card.y + 64, chipW, 68, 34);
  ctx.fillStyle = COLORS.orange;
  ctx.fill();
  ctx.fillStyle = COLORS.white;
  ctx.textBaseline = 'middle';
  ctx.fillText(chipText, padX + 32, card.y + 64 + 36);

  // Question text with auto-shrink so long bilingual questions still fit
  const artworkH = artwork ? 330 : 0;
  const textTop = card.y + 200;
  const textMaxH = card.h - 200 - artworkH - 60;

  for (const scale of [1, 0.85, 0.72, 0.6]) {
    const enSize = Math.round(62 * scale);
    const zhSize = Math.round(54 * scale);
    const enLH = Math.round(enSize * 1.3);
    const zhLH = Math.round(zhSize * 1.5);

    ctx.font = `${enSize}px "Patrick Hand", "Ma Shan Zheng", sans-serif`;
    const enLines = showEn ? wrapText(ctx, question.en, contentW) : [];
    ctx.font = `${zhSize}px "Ma Shan Zheng", "Patrick Hand", sans-serif`;
    const zhLines = showZh ? wrapText(ctx, question.zh, contentW) : [];

    const total = enLines.length * enLH + (enLines.length && zhLines.length ? 30 : 0) + zhLines.length * zhLH;
    if (total > textMaxH && scale !== 0.6) continue;

    let y = textTop;
    ctx.textBaseline = 'top';
    ctx.fillStyle = COLORS.ink;
    ctx.font = `${enSize}px "Patrick Hand", "Ma Shan Zheng", sans-serif`;
    for (const l of enLines) {
      ctx.fillText(l, padX, y);
      y += enLH;
    }
    if (enLines.length && zhLines.length) y += 30;
    ctx.fillStyle = showEn ? COLORS.gray : COLORS.ink;
    ctx.font = `${zhSize}px "Ma Shan Zheng", "Patrick Hand", sans-serif`;
    for (const l of zhLines) {
      ctx.fillText(l, padX, y);
      y += zhLH;
    }
    break;
  }

  // Artwork bottom-right
  if (artwork) {
    const maxH = 330;
    const maxW = 420;
    const ratio = Math.min(maxH / artwork.height, maxW / artwork.width);
    const aw = artwork.width * ratio;
    const ah = artwork.height * ratio;
    ctx.drawImage(artwork, card.x + card.w - aw - 60, card.y + card.h - ah - 50, aw, ah);
  }

  // Footer
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.gray;
  ctx.font = '38px "Patrick Hand", "Ma Shan Zheng", sans-serif';
  ctx.fillText('♡ cards.enrongpan.com', W / 2, H - 70);
  ctx.textAlign = 'left';

  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  return { dataUrl, blob };
}

/**
 * Try the native share sheet first (best on phones); if unavailable
 * (WeChat browser, desktop) return the dataUrl so the app can show a
 * "long-press to save" preview instead.
 */
export async function shareCardImage(opts) {
  const { dataUrl, blob } = await generateCardImage(opts);
  if (blob && navigator.canShare) {
    const file = new File([blob], 'truth-card.png', { type: 'image/png' });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return { shared: true };
      } catch {
        /* user cancelled or share failed — fall through to preview */
      }
    }
  }
  return { dataUrl };
}
