import React, { useState } from 'react';
import Card from './Card';
import { getCategoryDisplay, formatQuestionId } from '../utils/gameUtils';
import { Bi, useLang } from '../i18n';
import { ChevronIcon } from './Icons';

const CategoryDropdown = ({ category, questions, onQuestionSelect, usedIdSet }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lang = useLang();
  const d = getCategoryDisplay(category);
  const remaining = questions.filter((q) => !usedIdSet.has(q.id)).length;

  return (
    <div className="rounded-2xl border-2 border-pale-pink/30 bg-white/70 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 md:px-6 py-3.5 min-h-[56px] flex items-center justify-between gap-3 transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-3 text-left min-w-0">
          <ChevronIcon
            className={`w-4 h-4 shrink-0 text-orange-primary transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
          {lang === 'both' ? (
            <span className="min-w-0">
              <span className="block font-hand text-lg leading-tight text-ink truncate">{d.en}</span>
              <span className="block font-zh text-xs text-gray-secondary">{d.zh}</span>
            </span>
          ) : (
            <span className={`text-lg text-ink ${lang === 'zh' ? 'font-zh' : 'font-hand'}`}>
              {lang === 'zh' ? d.zh : d.en}
            </span>
          )}
        </span>
        <span className="text-xs text-gray-secondary shrink-0">
          {remaining}/{questions.length} <Bi en="left" zh="剩" />
        </span>
      </button>

      {isExpanded && (
        <div className="px-3 md:px-5 py-3 space-y-2 max-h-[50dvh] md:max-h-96 overflow-y-auto overscroll-contain bg-ivory/50">
          {questions.map((question) => {
            const isUsed = usedIdSet.has(question.id);
            return (
              <button
                key={question.id}
                onClick={() => onQuestionSelect(question)}
                disabled={isUsed}
                className={`w-full px-4 py-3 min-h-[44px] rounded-xl text-left font-zh text-[15px] transition-colors ${
                  isUsed
                    ? 'bg-pale-pink/15 text-gray-secondary/60 border-2 border-pale-pink/20 cursor-not-allowed'
                    : 'bg-white text-ink border-2 border-orange-primary/20 active:bg-orange-primary/10'
                }`}
              >
                {formatQuestionId(question.id, category)}
                {question.isCustom && <span className="ml-1.5 text-orange-primary">★</span>}
                {isUsed && (
                  <span className="ml-2 text-xs">
                    <Bi en="(used)" zh="（已用）" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Browse questions by category (IDs stay masked to keep the mystery),
 * then reveal the chosen one as a card.
 */
const ChooseMode = ({ questionsByCategory, onCardSelected, usedIds, image, onShare, blockedByName }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const usedIdSet = new Set(usedIds);

  const handleQuestionSelect = (question) => {
    if (blockedByName) return;
    setSelectedCard(question);
    onCardSelected(question);
  };

  if (selectedCard) {
    return (
      <div className="flex flex-col items-center gap-5 pt-2 md:pt-6">
        <div className="w-full min-h-[48dvh] md:min-h-[420px] flex items-center justify-center">
          <Card question={selectedCard} image={image} />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onShare}
            className="px-5 py-2.5 min-h-[48px] rounded-full bg-blue-primary/10 text-blue-primary active:scale-95 transition-transform"
          >
            <Bi en="Share" zh="分享" />
          </button>
          <button
            onClick={() => setSelectedCard(null)}
            className="px-7 py-2.5 min-h-[48px] rounded-full bg-orange-primary/15 text-gray-secondary text-lg active:scale-95 transition-transform"
          >
            <Bi en="Back to list" zh="返回列表" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="text-center space-y-1 pb-2">
        <p className="text-lg text-ink">
          <Bi en="Pick a category, then a question" zh="选择类别，再挑一道问题" />
        </p>
        <p className="text-xs text-gray-secondary">
          <Bi en="Questions stay hidden until you pick one" zh="问题在选中前保持神秘" />
        </p>
        {blockedByName && (
          <p className="text-sm text-orange-primary pt-1">
            <Bi en={`${blockedByName}'s turn — picking is paused`} zh={`轮到 ${blockedByName}——暂时不能选卡`} />
          </p>
        )}
      </div>

      {Object.keys(questionsByCategory).map((category) => (
        <CategoryDropdown
          key={category}
          category={category}
          questions={questionsByCategory[category]}
          onQuestionSelect={handleQuestionSelect}
          usedIdSet={usedIdSet}
        />
      ))}
    </div>
  );
};

export default ChooseMode;
