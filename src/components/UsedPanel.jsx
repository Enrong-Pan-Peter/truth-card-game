import React from 'react';
import { formatQuestionId } from '../utils/gameUtils';
import { Bi, useLang } from '../i18n';
import { ReturnIcon } from './Icons';

/** List of used cards (newest first) with return-to-deck. Lives in a Sheet. */
const UsedPanel = ({ usedCards, onReturnCard }) => {
  const lang = useLang();

  if (usedCards.length === 0) {
    return (
      <div className="text-center py-12 text-gray-secondary">
        <p className="text-lg">
          <Bi en="No used cards yet" zh="还没有使用过的卡牌" />
        </p>
        <p className="text-sm mt-1 opacity-70">
          <Bi en="Drawn cards will appear here" zh="抽过的卡会显示在这里" />
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {[...usedCards].reverse().map((card) => (
        <div
          key={card.id}
          className="flex items-center gap-3 p-3 rounded-xl bg-ivory/60 border-2 border-pale-pink/20"
        >
          <div className="flex-1 min-w-0">
            <p className="font-zh text-xs text-gray-secondary">
              {formatQuestionId(card.id, card.category)}
              {card.isCustom && <span className="ml-1.5 text-orange-primary">★</span>}
            </p>
            <p className={`text-sm text-ink line-clamp-2 mt-0.5 ${lang === 'zh' ? 'font-zh' : 'font-hand'}`}>
              {lang === 'zh' ? card.zh : card.en}
            </p>
          </div>
          <button
            onClick={() => onReturnCard(card.id)}
            className="w-11 h-11 shrink-0 rounded-xl bg-blue-primary/10 text-blue-primary flex items-center justify-center active:scale-95 transition-transform"
            title="Return to deck / 放回卡组"
            aria-label="Return to deck"
          >
            <ReturnIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default UsedPanel;
