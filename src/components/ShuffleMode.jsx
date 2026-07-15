import React, { useRef } from 'react';
import Card from './Card';
import { Bi } from '../i18n';
import { CardStackIcon } from './Icons';

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
}) => {
  const touchRef = useRef(null);
  const swiped = useRef(false);

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
        {currentCard ? (
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
            {canDraw && (
              <p className="text-center mt-4 text-sm text-gray-secondary">
                <Bi en="Tap or swipe the card for the next one" zh="点击或滑动卡片抽下一张" />
              </p>
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

      {/* Draw button + deck count */}
      <button
        onClick={onDraw}
        disabled={!canDraw || isDrawing}
        className={`px-12 py-3.5 min-h-[52px] rounded-full text-xl text-white transition-all duration-200 ${
          !canDraw || isDrawing
            ? 'bg-pale-pink cursor-not-allowed'
            : 'bg-blue-primary shadow-btn hover:scale-[1.03] active:scale-95'
        }`}
      >
        {isDrawing ? (
          <span className="flex items-center gap-2.5 justify-center">
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <Bi en="Drawing..." zh="抽卡中..." />
          </span>
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
    </div>
  );
};

export default ShuffleMode;
