import React, { useState } from 'react';
import { formatQuestionId } from '../utils/gameUtils';

const UsedCardsSidebar = ({ usedCards, onReturnCard }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-1/2 -translate-y-1/2 z-40
          bg-warm-coral text-white p-3 rounded-l-2xl shadow-lg
          transition-all duration-300 hover:bg-warm-coral/90
          ${isOpen ? 'right-80' : 'right-0'}
        `}
        aria-label="Toggle used cards sidebar"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-display">Used</span>
          <span className="text-xs">{usedCards.length}</span>
          <span className="text-lg">{isOpen ? '→' : '←'}</span>
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 bg-warm-cream shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-warm-brown-light/20 bg-warm-sand/30">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-display text-warm-brown-dark">
              Used Cards
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-warm-brown hover:text-warm-brown-dark transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-warm-brown/70">已使用的卡牌</p>
          <p className="text-xs text-warm-brown/60 mt-1">
            {usedCards.length} card{usedCards.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Used Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {usedCards.length === 0 ? (
            <div className="text-center py-12 text-warm-brown/50">
              <p className="font-display">No used cards yet</p>
              <p className="text-sm mt-1">还没有使用过的卡牌</p>
            </div>
          ) : (
            usedCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-warm-brown-light/20 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-warm-brown-dark text-sm mb-1">
                      {formatQuestionId(card.id, card.category)}
                    </p>
                    <p className="text-xs text-warm-brown/60 line-clamp-2">
                      {card.en}
                    </p>
                  </div>
                  <button
                    onClick={() => onReturnCard(card)}
                    className="flex-shrink-0 p-2 rounded-lg bg-warm-peach/30 hover:bg-warm-peach/50 text-warm-brown-dark transition-colors duration-200"
                    title="Return to deck"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {usedCards.length > 0 && (
          <div className="p-4 border-t-2 border-warm-brown-light/20 bg-warm-sand/30">
            <p className="text-xs text-warm-brown/60 text-center">
              Click ↩️ to return a card to the active deck
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UsedCardsSidebar;
