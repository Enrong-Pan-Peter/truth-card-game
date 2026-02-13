import React, { useState } from 'react';
import Card from './Card';
import { getCategoryDisplay, formatQuestionId } from '../utils/gameUtils';

const CategoryDropdown = ({ category, questions, onQuestionSelect, usedCardIds }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryDisplay = getCategoryDisplay(category);

  return (
    <div 
      className="rounded-2xl overflow-hidden"
      style={{
        border: '2px solid rgba(208, 183, 176, 0.3)',
        background: 'rgba(255, 255, 255, 0.7)'
      }}
    >
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between transition-colors duration-200"
        style={{
          background: isExpanded ? 'rgba(236, 182, 140, 0.1)' : 'transparent'
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isExpanded ? '▼' : '▶'}</span>
          <div className="text-left">
            <h3 
              className="text-xl"
              style={{
                fontFamily: "'Caveat', cursive",
                color: '#282828'
              }}
            >
              {categoryDisplay.en}
            </h3>
            <p className="text-sm" style={{ color: '#656565', fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif" }}>
              {categoryDisplay.zh}
            </p>
          </div>
        </div>
        <span className="text-sm" style={{ color: '#656565' }}>
          {questions.length} questions
        </span>
      </button>

      {/* Questions List */}
      {isExpanded && (
        <div 
          className="px-6 py-4 space-y-2 max-h-96 overflow-y-auto"
          style={{ background: 'rgba(255, 248, 235, 0.5)' }}
        >
          {questions.map((question) => {
            const isUsed = usedCardIds.includes(question.id);
            return (
              <button
                key={question.id}
                onClick={() => onQuestionSelect(question)}
                disabled={isUsed}
                className={`
                  w-full px-4 py-3 rounded-xl text-left transition-all duration-200
                  ${isUsed ? 'cursor-not-allowed' : ''}
                `}
                style={{
                  background: isUsed ? 'rgba(208, 183, 176, 0.2)' : '#FFFFFF',
                  color: isUsed ? '#656565' : '#282828',
                  border: `1px solid ${isUsed ? 'rgba(208, 183, 176, 0.3)' : 'rgba(236, 182, 140, 0.2)'}`,
                  opacity: isUsed ? 0.5 : 1,
                  fontFamily: "'Caveat', cursive"
                }}
              >
                <span>
                  {formatQuestionId(question.id, category)}
                </span>
                {isUsed && (
                  <span className="ml-2 text-xs">(Used)</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ChooseMode = ({ questionsByCategory, onCardSelected, usedCardIds, currentImageIndex, cardImages }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleQuestionSelect = (question) => {
    setSelectedCard(question);
    onCardSelected(question);
  };

  const handleCloseCard = () => {
    setSelectedCard(null);
  };

  return (
    <div className="space-y-6">
      {!selectedCard ? (
        <>
          {/* Instructions */}
          <div className="text-center mb-8 space-y-2">
            <p 
              className="text-lg"
              style={{
                fontFamily: "'Caveat', cursive",
                color: '#282828'
              }}
            >
              Choose a category and select a question
            </p>
            <p 
              className="text-sm"
              style={{
                color: '#656565',
                fontFamily: "'Ma Shan Zheng', 'Crimson Text', serif"
              }}
            >
              选择类别并挑选问题
            </p>
          </div>

          {/* Category Dropdowns */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {Object.keys(questionsByCategory).map((category) => (
              <CategoryDropdown
                key={category}
                category={category}
                questions={questionsByCategory[category]}
                onQuestionSelect={handleQuestionSelect}
                usedCardIds={usedCardIds}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="min-h-[400px] flex items-center justify-center">
          <Card 
            question={selectedCard} 
            onClose={handleCloseCard} 
            currentImage={cardImages[currentImageIndex]}
          />
        </div>
      )}
    </div>
  );
};

export default ChooseMode;
