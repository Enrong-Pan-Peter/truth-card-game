import React, { useState, useEffect } from 'react';
import { getRandomSketch } from './Sketches';
import { getCategoryDisplay } from '../utils/gameUtils';

const Card = ({ question, onClose }) => {
  const [SketchComponent, setSketchComponent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get random sketch when card mounts
    setSketchComponent(() => getRandomSketch());
    // Trigger entrance animation
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
      <div className="bg-[#F5EDE8] rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl mx-auto border-2 border-warm-brown-light/20">
        <div className="flex flex-col md:flex-row">
          {/* Question Text Section - 75% */}
          <div className="flex-[3] p-8 md:p-10 lg:p-14 space-y-6 md:space-y-8">
            {/* Category Badge */}
            <div className="inline-block">
              <span className="text-sm font-display bg-warm-coral/20 text-warm-brown-dark px-4 py-2 rounded-full">
                {categoryDisplay.en} / {categoryDisplay.zh}
              </span>
            </div>

            {/* English Question */}
            <div className="space-y-3">
              <p className="text-2xl md:text-3xl lg:text-4xl font-display text-warm-brown-dark leading-relaxed">
                {question.en}
              </p>
            </div>

            {/* Chinese Question */}
            <div className="space-y-3">
              <p className="text-xl md:text-2xl lg:text-3xl font-sans text-warm-brown leading-relaxed">
                {question.zh}
              </p>
            </div>
          </div>

          {/* Sketch Section - 25% */}
          <div className="flex-[1] bg-warm-sand/30 p-6 md:p-8 flex items-center justify-center min-h-[180px] md:min-h-[250px] lg:min-h-0">
            <div className="w-full max-w-[120px] md:max-w-[160px] lg:max-w-[200px] opacity-70">
              {SketchComponent && <SketchComponent />}
            </div>
          </div>
        </div>
      </div>

      {/* Close button for mobile */}
      {onClose && (
        <div className="text-center mt-4">
          <button
            onClick={onClose}
            className="text-warm-brown hover:text-warm-brown-dark transition-colors duration-200 text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
