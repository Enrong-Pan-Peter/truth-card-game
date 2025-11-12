// This component loads an image from the public folder
// To use your own image:
// 1. Put your image in: /public/card-picture.png (or .jpg, .svg)
// 2. Change the filename below to match
// 3. Use transparent PNG for best results
// 4. The image will automatically show on every card

export const CardPicture = () => (
  <div className="w-full h-full flex items-center justify-center">
    <img 
      src="totoro.png" 
      alt="Card picture" 
      className="w-full h-full object-contain"
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    />
  </div>
);

// Always return the same card picture
export const getRandomSketch = () => {
  return CardPicture;
};

export default CardPicture;
