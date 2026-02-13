import React, { useState, useEffect } from 'react';
import { getCategoryDisplay } from '../utils/gameUtils';

const Card = ({ question, onClose, currentImage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    setIsShuffling(true);
    setTimeout(() => setIsShuffling(false), 600);
    
    setTimeout(() => setIsVisible(true), 50);
  }, [question]);

  if (!question) return null;

  const categoryDisplay = getCategoryDisplay(question.category);

  return (
    <div 
      className={`transition-all duration-500 transform w-full ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="relative w-full max-w-2xl mx-auto" style={{ minHeight: '350px', perspective: '1000px' }}>
        
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: '#FFF8EB',
            boxShadow: '0 8px 32px rgba(40, 40, 40, 0.15)',
            zIndex: 1
          }}
        />

        <div 
          className={`relative rounded-3xl overflow-hidden ${isShuffling ? 'card-shuffle-animation' : ''}`}
          style={{
            background: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(40, 40, 40, 0.1), 0 8px 32px rgba(40, 40, 40, 0.05)',
            transform: 'rotate(-2deg)',
            transformOrigin: 'center center',
            zIndex: 2,
            minHeight: '350px',
            border: '2px solid rgba(208, 183, 176, 0.2)'
          }}
        >
          <div className="flex flex-col md:flex-row h-full">
            <div className="flex-[7] p-6 md:p-8 space-y-4 md:space-y-6">
              <div className="inline-block">
                <span 
                  className="text-sm px-4 py-2 rounded-full"
                  style={{
                    background: '#ECB68C',
                    color: '#FFFFFF',
                    fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif",
                    boxShadow: '0 2px 8px rgba(236, 182, 140, 0.3)'
                  }}
                >
                  {categoryDisplay.en} / {categoryDisplay.zh}
                </span>
              </div>

              <div className="space-y-2">
                <p 
                  className="text-2xl md:text-3xl leading-relaxed"
                  style={{
                    fontFamily: "'Patrick Hand', cursive",
                    fontWeight: 600,
                    color: '#282828'
                  }}
                >
                  {question.en}
                </p>
              </div>

              <div className="space-y-2">
                <p 
                  className="text-xl md:text-2xl leading-relaxed"
                  style={{
                    fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif",
                    color: '#656565'
                  }}
                >
                  {question.zh}
                </p>
              </div>
            </div>

            <div 
              className="flex-[3] p-4 md:p-6 flex items-center justify-center min-h-[150px] md:min-h-0"
              style={{ background: '#FFFFFF' }}
            >
              <div className="w-full max-w-[120px] md:max-w-[180px] flex items-center justify-center">
                {currentImage ? (
                  <img 
                    src={currentImage} 
                    alt="Card decoration"
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: '180px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-24 flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 opacity-20"
                      style={{ color: '#656565' }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {onClose && (
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="transition-colors duration-200 text-sm px-6 py-2 rounded-full"
            style={{
              color: '#656565',
              fontFamily: "'Patrick Hand', cursive",
              background: 'rgba(236, 182, 140, 0.1)'
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;