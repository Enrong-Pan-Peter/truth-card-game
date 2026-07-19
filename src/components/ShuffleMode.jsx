import React, { useEffect, useRef, useState } from 'react';
import Card from './Card';
import { Bi } from '../i18n';
import { CardStackIcon, RedrawIcon, ShareIcon } from './Icons';

const REACTION_EMOJI = ['❤️', '🙏', '😂', '👏'];

const TimerChip = ({ minutes, resetKey }) => {
  const [left, setLeft] = useState(minutes * 60);
  useEffect(() => {
    setLeft(minutes * 60);
    if (!minutes) return undefined;
    const iv = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(iv);
  }, [minutes, resetKey]);
  if (!minutes) return null;
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');
  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs tabular-nums ${
        left === 0 ? 'bg-orange-primary text-white' : 'bg-blue-primary/10 text-blue-primary'
      }`}
    >
      {left === 0 ? <Bi en="Time's up!" zh="时间到！" /> : `${mm}:${ss}`}
    </span>
  );
};

/**
 * Draw-a-random-card screen. Tap or swipe the card for the next question.
 * Deck/filter state lives in App; this is purely presentational.
 */
const ShuffleMode = ({
  currentCard,
  image,
  isDrawing,
  canDraw,
  filteredCount,
  totalInSelected,
  allowRepeat,
  onDraw,
  onReset,
  onOpenFilter,
  onSkipCard,
  onShare,
  timerMin,
  // session presets
  sessionDone,
  sessionRecap,
  onContinueSession,
  // room extras
  inRoom,
  drawnBy,
  turns, // { enabled, myTurn, currentName } | null
  onSkipTurn,
  onReact,
}) => {
  const touchRef = useRef(null);
  const swiped = useRef(false);

  const turnsOn = !!turns?.enabled;
  const blocked = turnsOn && !turns.myTurn;

  const handleTouchStart = (e) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swiped.current = false;
  };
  const handleTouchEnd = (e) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.abs(dx) > 56 && Math.abs(dy) < 64) {
      swiped.current = true;
      onDraw();
    }
  };
  const handleClick = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    onDraw();
  };

  const noCategories = totalInSelected === 0;
  const allUsed = !noCategories && filteredCount === 0 && !allowRepeat;

  return (
    <div className="flex flex-col items-center gap-6 pt-1 md:pt-4">
      {/* Card stage */}
      <div className="w-full min-h-[48dvh] md:min-h-[420px] flex flex-col items-center justify-center">
        {sessionDone ? (
          <div className="text-center space-y-5 px-4">
            <p className="text-3xl">🎉</p>
            <p className="text-2xl text-ink">
              <Bi en="Session complete!" zh="本场结束啦！" />
            </p>
            {sessionRecap && (
              <div className="inline-block text-left bg-white rounded-2xl border-2 border-pale-pink/30 px-5 py-4 space-y-1">
                <p className="text-sm text-gray-secondary pb-1">
                  <Bi en={`${sessionRecap.total} cards drawn`} zh={`共抽了 ${sessionRecap.total} 张`} />
                </p>
                {sessionRecap.byCategory.map((c) => (
                  <p key={c.key} className="text-sm text-ink flex justify-between gap-6">
                    <Bi en={c.en} zh={c.zh} />
                    <span className="text-gray-secondary">{c.count}</span>
                  </p>
                ))}
              </div>
            )}
            <div className="flex justify-center gap-3">
              <button
                onClick={onContinueSession}
                className="px-6 py-3 min-h-[48px] rounded-full bg-blue-primary text-white shadow-btn active:scale-95 transition-transform"
              >
                <Bi en="Keep going" zh="继续玩" />
              </button>
              <button
                onClick={onReset}
                className="px-6 py-3 min-h-[48px] rounded-full bg-orange-primary/15 text-gray-secondary active:scale-95 transition-transform"
              >
                <Bi en="Reset deck" zh="重置卡组" />
              </button>
            </div>
          </div>
        ) : currentCard ? (
          <div className="w-full">
            <div
              role="button"
              tabIndex={0}
              aria-label="Draw next card"
              className="w-full cursor-pointer outline-none"
              onClick={handleClick}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onDraw();
                }
              }}
            >
              <Card question={currentCard} image={image} />
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              {inRoom && drawnBy && (
                <span className="text-sm text-blue-primary">
                  <Bi en={`Drawn by ${drawnBy}`} zh={`${drawnBy} 抽的`} />
                </span>
              )}
              <TimerChip minutes={timerMin} resetKey={currentCard.id} />
            </div>
            {canDraw && !blocked && (
              <p className="text-center text-sm text-gray-secondary mt-1.5">
                <Bi en="Tap or swipe the card for the next one" zh="点击或滑动卡片抽下一张" />
              </p>
            )}

            {/* Card actions */}
            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={onShare}
                className="px-4 py-2 min-h-[40px] rounded-full bg-blue-primary/10 text-blue-primary text-sm flex items-center gap-1.5 active:scale-95 transition-transform"
              >
                <ShareIcon className="w-4 h-4" />
                <Bi en="Share" zh="分享" />
              </button>
              {canDraw && !blocked && (
                <button
                  onClick={onSkipCard}
                  disabled={isDrawing}
                  className="px-4 py-2 min-h-[40px] rounded-full bg-pale-pink/20 text-gray-secondary text-sm flex items-center gap-1.5 active:scale-95 transition-transform"
                  title="Draw another without using this one up"
                >
                  <RedrawIcon className="w-4 h-4" />
                  <Bi en="Skip" zh="换一张" />
                </button>
              )}
            </div>

            {/* Reactions (rooms) */}
            {inRoom && onReact && (
              <div className="flex justify-center gap-2 mt-3">
                {REACTION_EMOJI.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onReact(emoji)}
                    className="w-11 h-11 rounded-full bg-white border-2 border-pale-pink/30 text-lg active:scale-90 transition-transform"
                    aria-label={`React ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-5 px-4 text-gray-secondary">
            {noCategories ? (
              <>
                <p className="text-xl">
                  <Bi en="No categories selected" zh="还没有选择类别" />
                </p>
                <button
                  onClick={onOpenFilter}
                  className="px-7 py-3 min-h-[48px] rounded-full bg-orange-primary text-white text-lg shadow-btn-orange active:scale-95 transition-transform"
                >
                  <Bi en="Open Filter" zh="打开筛选" />
                </button>
              </>
            ) : allUsed ? (
              <>
                <p className="text-2xl text-ink">
                  <Bi en="All cards have been used!" zh="所有卡片都用过啦！" />
                </p>
                <button
                  onClick={onReset}
                  className="px-7 py-3 min-h-[48px] rounded-full bg-orange-primary text-white text-lg shadow-btn-orange active:scale-95 transition-transform"
                >
                  <Bi en="Reset Deck" zh="重置卡组" />
                </button>
              </>
            ) : (
              <>
                <CardStackIcon className="w-20 h-20 mx-auto opacity-25" />
                <p className="text-xl">
                  <Bi en="Tap Draw to start" zh="点击抽卡开始" />
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Turn banner */}
      {turnsOn && !sessionDone && (
        <div
          className={`-mb-2 px-5 py-2 rounded-full text-sm flex items-center gap-2 ${
            turns.myTurn
              ? 'bg-blue-primary text-white shadow-btn'
              : 'bg-orange-primary/15 text-gray-secondary'
          }`}
        >
          {turns.myTurn ? (
            <Bi en="Your turn!" zh="轮到你啦！" />
          ) : (
            <>
              <Bi en={`${turns.currentName}'s turn`} zh={`轮到 ${turns.currentName}`} />
              <button onClick={onSkipTurn} className="underline underline-offset-2 text-blue-primary text-xs">
                <Bi en="skip" zh="跳过" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Draw button + deck count */}
      {!sessionDone && (
        <>
          <button
            onClick={onDraw}
            disabled={!canDraw || isDrawing || blocked}
            className={`px-12 py-3.5 min-h-[52px] rounded-full text-xl text-white transition-all duration-200 ${
              !canDraw || isDrawing || blocked
                ? 'bg-pale-pink cursor-not-allowed'
                : 'bg-blue-primary shadow-btn hover:scale-[1.03] active:scale-95'
            }`}
          >
            {isDrawing ? (
              <span className="flex items-center gap-2.5 justify-center">
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <Bi en="Drawing..." zh="抽卡中..." />
              </span>
            ) : blocked ? (
              <Bi en={`${turns.currentName}'s turn`} zh={`轮到 ${turns.currentName}`} />
            ) : !canDraw && currentCard ? (
              <Bi en="No cards left" zh="没有卡片了" />
            ) : (
              <Bi en="Draw a Card" zh="抽卡" />
            )}
          </button>

          <div className="text-sm text-gray-secondary -mt-2 flex items-center gap-3">
            <span>
              {allowRepeat ? (
                <Bi en={`${totalInSelected} cards · repeats on`} zh={`${totalInSelected} 张 · 可重复`} />
              ) : (
                <Bi en={`${filteredCount} cards left`} zh={`剩余 ${filteredCount} 张`} />
              )}
            </span>
            {allUsed && currentCard && (
              <button onClick={onReset} className="text-blue-primary underline underline-offset-2">
                <Bi en="Reset" zh="重置" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShuffleMode;
