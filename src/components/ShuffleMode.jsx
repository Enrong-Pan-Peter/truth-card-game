import React, { useState } from 'react';
import Card from './Card';
import { drawRandomCard, areAllCardsUsed } from '../utils/gameUtils';

const ShuffleMode = ({ activeDeck, onCardDrawn, onReset }) => {
  const [currentCard, setCurrentCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleShuffle = () => {
    if (areAllCardsUsed(activeDeck)) {
      return;
    }

    setIsDrawing(true);
    
    // Brief delay for animation
    setTimeout(() => {
      const drawnCard = drawRandomCard(activeDeck);
      if (drawnCard) {
        setCurrentCard(drawnCard);
        onCardDrawn(drawnCard);
      }
      setIsDrawing(false);
    }, 300);
  };

  const allUsed = areAllCardsUsed(activeDeck);

  return (
    <div className="space-y-8">
      {/* Shuffle Button */}
      <div className="text-center">
        <button
          onClick={handleShuffle}
          disabled={allUsed || isDrawing}
          className={`
            px-10 py-4 rounded-full text-lg font-display font-semibold
            transition-all duration-300 transform
            ${allUsed || isDrawing
              ? 'bg-warm-brown-light/30 text-warm-brown-light cursor-not-allowed'
              : 'bg-warm-coral text-white hover:bg-warm-coral/90 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isDrawing ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Drawing...
            </span>
          ) : allUsed ? (
            'All Cards Used'
          ) : (
            <>Shuffle / 抽卡</>
          )}
        </button>

        {/* Card counter */}
        <p className="mt-3 text-sm text-warm-brown/70">
          {activeDeck.length} cards remaining
        </p>
      </div>

      {/* Current Card Display */}
      <div className="min-h-[400px] flex items-center justify-center">
        {currentCard ? (
          <Card question={currentCard} />
        ) : (
          <div className="text-center space-y-4 text-warm-brown/60">
            {allUsed ? (
              <>
                <p className="text-xl font-display">All cards have been used!</p>
                <button
                  onClick={onReset}
                  className="px-6 py-3 bg-warm-peach text-warm-brown-dark rounded-full font-display hover:bg-warm-peach/80 transition-colors duration-200"
                >
                  Reset Deck / 重置卡牌
                </button>
              </>
            ) : (
              <>
                <svg
                  className="w-20 h-20 mx-auto opacity-30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-lg font-display">Click "Shuffle" to draw a card</p>
                <p className="text-sm">点击"抽卡"开始</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShuffleMode;
