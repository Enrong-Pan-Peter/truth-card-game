// Updated Sketches.jsx - Supports random image selection
// Images will be passed from parent component (App.jsx)
// This component is kept for backward compatibility

export const CardPicture = ({ imageSrc }) => {
  if (!imageSrc) {
    // Fallback: show a placeholder
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg 
          className="w-16 h-16 opacity-30"
          style={{ color: '#656565' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img 
        src={imageSrc} 
        alt="Card picture" 
        className="w-full h-full object-contain"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
        onError={(e) => {
          // Hide image if it fails to load
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

// For backward compatibility
export const getRandomSketch = () => {
  return CardPicture;
};

export default CardPicture;
