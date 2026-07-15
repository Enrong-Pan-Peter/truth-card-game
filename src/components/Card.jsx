import React, { useEffect, useState } from 'react';
import { getCategoryDisplay } from '../utils/gameUtils';
import { Bi, useLang } from '../i18n';

/** The question card: compact on mobile, text + illustration side by side on desktop. */
const Card = ({ question, image }) => {
  const lang = useLang();
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    setShuffling(true);
    const t = setTimeout(() => setShuffling(false), 500);
    return () => clearTimeout(t);
  }, [question]);

  if (!question) return null;

  const cat = getCategoryDisplay(question.category);
  const showEn = lang !== 'zh' && question.en;
  // Don't show the same text twice for custom questions filled in one language
  const showZh = lang !== 'en' && question.zh && !(showEn && question.zh === question.en);

  return (
    <div className="w-full max-w-xl md:max-w-2xl mx-auto select-none">
      <div className="relative">
        {/* Stacked-deck back layer */}
        <div
          className="absolute inset-0 translate-x-2 translate-y-2 rounded-3xl bg-pale-pink/25"
          aria-hidden="true"
        />
        <div
          className={`relative bg-white rounded-3xl border-2 border-pale-pink/20 shadow-card -rotate-1 ${
            shuffling ? 'card-shuffle-animation' : ''
          }`}
        >
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 min-h-[280px] md:min-h-[340px]">
            <div className="flex-1 flex flex-col justify-center gap-4 md:gap-5">
              <span className="self-start text-xs md:text-sm px-3.5 py-1.5 rounded-full bg-orange-primary text-white shadow-btn-orange">
                <Bi en={cat.en} zh={cat.zh} enClass="font-hand" zhClass="font-zh" />
              </span>

              {showEn && (
                <p className="font-hand text-2xl md:text-3xl leading-snug text-ink">{question.en}</p>
              )}
              {showZh && (
                <p
                  className={`font-zh leading-relaxed ${
                    lang === 'zh' ? 'text-2xl md:text-3xl text-ink' : 'text-xl md:text-2xl text-gray-secondary'
                  }`}
                >
                  {question.zh}
                </p>
              )}
            </div>

            {image && (
              <div className="shrink-0 flex justify-end md:justify-center items-end md:items-center">
                <img
                  src={image}
                  alt=""
                  draggable="false"
                  className="h-24 md:h-56 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
