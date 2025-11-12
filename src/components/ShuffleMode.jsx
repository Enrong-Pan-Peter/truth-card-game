import React, { useState } from 'react';
import Card from './Card';
import { drawRandomCard, areAllCardsUsed, getCategoryDisplay } from '../utils/gameUtils';

const ShuffleMode = ({ activeDeck, onCardDrawn, onReset }) => {
  const [currentCard, setCurrentCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState({
    getting_to_know: true,
    ideals_reals: true,
    heart_to_heart: true,
    memories: true,
    matters_of_soul: true
  });

  const toggleCategory = (category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getFilteredDeck = () => {
    return activeDeck.filter(card => selectedCategories[card.category]);
  };

  const handleShuffle = () => {
    const filteredDeck = getFilteredDeck();
    
    if (filteredDeck.length === 0) {
      return;
    }

    setIsDrawing(true);
    
    setTimeout(() => {
      const drawnCard = drawRandomCard(filteredDeck);
      if (drawnCard) {
        setCurrentCard(drawnCard);
        onCardDrawn(drawnCard);
      }
      setIsDrawing(false);
    }, 300);
  };

  const filteredDeck = getFilteredDeck();
  const allUsed = filteredDeck.length === 0;
  const categories = ['getting_to_know', 'ideals_reals', 'heart_to_heart', 'memories', 'matters_of_soul'];

  return (
    <div className="relative">
      {/* Filter Toggle Button (Left side) */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className={`
          fixed top-1/2 -translate-y-1/2 z-40
          bg-warm-coral text-white p-3 rounded-r-2xl shadow-lg
          transition-all duration-300 hover:bg-warm-coral/90
          ${isFilterOpen ? 'left-80' : 'left-0'}
        `}
        aria-label="Toggle filter categories"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-display">Filter</span>
          <span className="text-xs">{Object.values(selectedCategories).filter(Boolean).length}/5</span>
          <span className="text-lg">{isFilterOpen ? '←' : '→'}</span>
        </div>
      </button>

      {/* Backdrop */}
      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
        />
      )}

      {/* Filter Sidebar (Left side, collapsible) */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 bg-warm-cream shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-warm-brown-light/20 bg-warm-sand/30">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-display text-warm-brown-dark">
              Filter Categories
            </h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-warm-brown hover:text-warm-brown-dark transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-warm-brown/70">选择类别</p>
          <p className="text-xs text-warm-brown/60 mt-1">
            {Object.values(selectedCategories).filter(Boolean).length} selected
          </p>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {categories.map(category => {
            const display = getCategoryDisplay(category);
            return (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories[category]}
                  onChange={() => toggleCategory(category)}
                  className="w-5 h-5 rounded border-2 border-warm-brown-light/40 checked:bg-warm-peach checked:border-warm-peach focus:ring-warm-peach focus:ring-2 accent-warm-peach flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-display text-warm-brown-dark group-hover:text-warm-peach transition-colors">
                    {display.en}
                  </p>
                  <p className="text-xs text-warm-brown/70">
                    {display.zh}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-warm-brown-light/20 bg-warm-sand/30">
          <p className="text-xs text-warm-brown/60 text-center">
            Select categories to include in shuffle
          </p>
        </div>
      </div>

      {/* Main Content - Centered and Larger */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Shuffle Button - Larger */}
        <div className="text-center">
          <button
            onClick={handleShuffle}
            disabled={allUsed || isDrawing}
            className={`
              px-16 py-6 rounded-full text-2xl font-display font-semibold
              transition-all duration-300 transform
              ${allUsed || isDrawing
                ? 'bg-warm-brown-light/30 text-warm-brown-light cursor-not-allowed'
                : 'bg-warm-coral text-white hover:bg-warm-coral/90 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl'
              }
            `}
          >
            {isDrawing ? (
              <span className="flex items-center gap-3">
                <span className="inline-block w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Drawing...
              </span>
            ) : allUsed ? (
              'No Cards Available'
            ) : (
              <>Shuffle / 抽卡</>
            )}
          </button>

          <p className="mt-4 text-base text-warm-brown/70">
            {filteredDeck.length} cards in selected categories
          </p>
        </div>

        {/* Current Card Display - Larger and Centered */}
        <div className="min-h-[500px] flex items-center justify-center">
          {currentCard ? (
            <div className="w-full">
              <Card question={currentCard} />
            </div>
          ) : (
            <div className="text-center space-y-6 text-warm-brown/60 px-4">
              {allUsed ? (
                <>
                  <p className="text-2xl font-display">All cards have been used!</p>
                  <button
                    onClick={onReset}
                    className="px-8 py-4 bg-warm-peach text-white rounded-full font-display text-lg hover:bg-warm-peach/80 transition-colors duration-200 shadow-lg"
                  >
                    Reset Deck / 重置卡牌
                  </button>
                </>
              ) : (
                <>
                  <svg
                    className="w-24 h-24 mx-auto opacity-30"
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
                  <p className="text-xl font-display">Click "Shuffle" to draw a card</p>
                  <p className="text-base">点击"抽卡"开始</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShuffleMode;
