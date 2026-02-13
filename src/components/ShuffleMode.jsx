import React, { useState } from 'react';
import Card from './Card';
import { drawRandomCard, getCategoryDisplay } from '../utils/gameUtils';

const ShuffleMode = ({ activeDeck, onCardDrawn, onReset, currentImageIndex, cardImages }) => {
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

  // Click/tap on card to draw next card
  const handleCardClick = () => {
    if (!isDrawing && !allUsed) {
      handleShuffle();
    }
  };

  const filteredDeck = getFilteredDeck();
  const allUsed = filteredDeck.length === 0;
  const categories = ['getting_to_know', 'ideals_reals', 'heart_to_heart', 'memories', 'matters_of_soul'];

  return (
    <div className="relative">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className={`
          fixed top-1/2 -translate-y-1/2 z-40
          p-3 rounded-r-2xl shadow-lg
          transition-all duration-300
          ${isFilterOpen ? 'left-80' : 'left-0'}
        `}
        style={{
          background: '#ECB68C',
          color: '#FFFFFF'
        }}
        aria-label="Toggle filter categories"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm" style={{ fontFamily: "'Patrick Hand', cursive" }}>Filter</span>
          <span className="text-xs">{Object.values(selectedCategories).filter(Boolean).length}/5</span>
          <span className="text-lg">{isFilterOpen ? '←' : '→'}</span>
        </div>
      </button>

      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-full w-80 shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
        style={{ background: '#ECB68C' }}
      >
        <div 
          className="p-6 flex flex-col gap-2"
          style={{ 
            borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            <h2 
              className="text-2xl"
              style={{ 
                fontFamily: "'Patrick Hand', cursive",
                color: '#FFFFFF'
              }}
            >
              Filter Categories
            </h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="transition-colors"
              style={{ color: '#FFFFFF' }}
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>
            选择类别
          </p>
          <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {Object.values(selectedCategories).filter(Boolean).length} selected
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {categories.map(category => {
            const display = getCategoryDisplay(category);
            return (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl transition-colors"
                style={{
                  background: selectedCategories[category] 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories[category]}
                  onChange={() => toggleCategory(category)}
                  className="w-5 h-5 rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-sm transition-colors"
                    style={{
                      fontFamily: "'Patrick Hand', cursive",
                      color: '#FFFFFF'
                    }}
                  >
                    {display.en}
                  </p>
                  <p 
                    className="text-xs"
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif"
                    }}
                  >
                    {display.zh}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        <div 
          className="p-4"
          style={{ 
            borderTop: '2px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <p className="text-xs text-center" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Select categories to include in shuffle
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        <div className="text-center">
          <button
            onClick={handleShuffle}
            disabled={allUsed || isDrawing}
            className={`
              px-16 py-6 rounded-full text-2xl font-semibold
              transition-all duration-300 transform
              ${allUsed || isDrawing ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 active:scale-95'}
            `}
            style={{
              fontFamily: "'Patrick Hand', cursive",
              background: allUsed || isDrawing ? '#D0B7B0' : '#4D7491',
              color: '#FFFFFF',
              boxShadow: allUsed || isDrawing ? 'none' : '0 4px 16px rgba(77, 116, 145, 0.4)'
            }}
          >
            {isDrawing ? (
              <span className="flex items-center gap-3 justify-center">
                <span className="inline-block w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Drawing...
              </span>
            ) : allUsed ? (
              'No Cards Available'
            ) : (
              <>
                <span style={{ fontFamily: "'Patrick Hand', cursive" }}>Shuffle</span>
                {' / '}
                <span style={{ fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>抽卡</span>
              </>
            )}
          </button>

          <p className="mt-4 text-base" style={{ color: '#656565' }}>
            {filteredDeck.length} cards in selected categories
          </p>
        </div>

        <div className="min-h-[500px] flex items-center justify-center">
          {currentCard ? (
            <div 
              className="w-full cursor-pointer"
              onClick={handleCardClick}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCardClick();
                }
              }}
              aria-label="Click to draw next card"
            >
              <Card 
                question={currentCard} 
                currentImage={cardImages[currentImageIndex]}
              />
              <p className="text-center mt-4 text-sm" style={{ 
                color: '#656565',
                fontFamily: "'Patrick Hand', cursive"
              }}>
                <span style={{ fontFamily: "'Patrick Hand', cursive" }}>Tap card for next question</span>
                {' / '}
                <span style={{ fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>点击卡片抽下一张</span>
              </p>
            </div>
          ) : (
            <div className="text-center space-y-6 px-4" style={{ color: '#656565' }}>
              {allUsed ? (
                <>
                  <p className="text-2xl" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                    All cards have been used!
                  </p>
                  <button
                    onClick={onReset}
                    className="px-8 py-4 rounded-full text-lg transition-colors duration-200"
                    style={{
                      background: '#ECB68C',
                      color: '#FFFFFF',
                      fontFamily: "'Patrick Hand', cursive",
                      boxShadow: '0 4px 12px rgba(236, 182, 140, 0.3)'
                    }}
                  >
                    <span style={{ fontFamily: "'Patrick Hand', cursive" }}>Reset Deck</span>
                    {' / '}
                    <span style={{ fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>重置卡牌</span>
                  </button>
                </>
              ) : (
                <>
                  <svg
                    className="w-24 h-24 mx-auto opacity-30"
                    style={{ color: '#656565' }}
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
                  <p className="text-xl" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                    Click "Shuffle" to draw a card
                  </p>
                  <p className="text-base" style={{ fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>
                    点击"抽卡"开始
                  </p>
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
