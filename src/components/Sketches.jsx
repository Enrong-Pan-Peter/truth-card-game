export const Totoro1 = () => (
  <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g stroke="#3D3D3D" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Body */}
      <ellipse cx="60" cy="80" rx="35" ry="45" opacity="0.9"/>
      
      {/* Ears */}
      <path d="M 35 50 Q 25 25 30 15" />
      <path d="M 85 50 Q 95 25 90 15" />
      
      {/* Eyes */}
      <circle cx="48" cy="70" r="5" fill="#3D3D3D"/>
      <circle cx="72" cy="70" r="5" fill="#3D3D3D"/>
      
      {/* Nose */}
      <path d="M 60 78 L 55 85 L 60 87 L 65 85 Z" fill="#3D3D3D"/>
      
      {/* Whiskers */}
      <path d="M 30 75 L 45 74" opacity="0.7"/>
      <path d="M 30 80 L 45 80" opacity="0.7"/>
      <path d="M 90 75 L 75 74" opacity="0.7"/>
      <path d="M 90 80 L 75 80" opacity="0.7"/>
      
      {/* Belly marks */}
      <path d="M 45 95 Q 50 90 55 95" opacity="0.8"/>
      <path d="M 55 100 Q 60 95 65 100" opacity="0.8"/>
      <path d="M 65 105 Q 70 100 75 105" opacity="0.8"/>
      
      {/* Arms */}
      <path d="M 30 85 Q 20 85 18 90" strokeWidth="2"/>
      <path d="M 90 85 Q 100 85 102 90" strokeWidth="2"/>
      
      {/* Legs */}
      <ellipse cx="48" cy="120" rx="10" ry="7" opacity="0.8"/>
      <ellipse cx="72" cy="120" rx="10" ry="7" opacity="0.8"/>
    </g>
  </svg>
);

export const Totoro2 = () => (
  <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g stroke="#3D3D3D" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Body - slightly tilted */}
      <ellipse cx="60" cy="80" rx="38" ry="42" transform="rotate(-5 60 80)" opacity="0.9"/>
      
      {/* Ears */}
      <path d="M 33 52 Q 22 30 28 20" />
      <path d="M 87 52 Q 98 30 92 20" />
      
      {/* Eyes - happy */}
      <path d="M 44 68 Q 48 72 52 68" strokeWidth="2" fill="#3D3D3D"/>
      <path d="M 68 68 Q 72 72 76 68" strokeWidth="2" fill="#3D3D3D"/>
      
      {/* Nose */}
      <circle cx="60" cy="82" r="4" fill="#3D3D3D"/>
      
      {/* Mouth - smile */}
      <path d="M 52 88 Q 60 94 68 88" strokeWidth="1.5"/>
      
      {/* Belly pattern */}
      <circle cx="50" cy="98" r="3" opacity="0.7"/>
      <circle cx="60" cy="102" r="3" opacity="0.7"/>
      <circle cx="70" cy="98" r="3" opacity="0.7"/>
    </g>
  </svg>
);

export const Cat1 = () => (
  <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g stroke="#3D3D3D" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <circle cx="60" cy="55" r="25" opacity="0.9"/>
      
      {/* Ears */}
      <path d="M 40 40 L 35 20 L 45 35" />
      <path d="M 80 40 L 85 20 L 75 35" />
      
      {/* Eyes */}
      <ellipse cx="50" cy="52" rx="3" ry="5" fill="#3D3D3D"/>
      <ellipse cx="70" cy="52" rx="3" ry="5" fill="#3D3D3D"/>
      
      {/* Nose */}
      <path d="M 60 60 L 58 63 L 60 64 L 62 63 Z" fill="#3D3D3D"/>
      
      {/* Whiskers */}
      <path d="M 30 58 L 45 57" opacity="0.7"/>
      <path d="M 30 62 L 45 62" opacity="0.7"/>
      <path d="M 90 58 L 75 57" opacity="0.7"/>
      <path d="M 90 62 L 75 62" opacity="0.7"/>
      
      {/* Body */}
      <ellipse cx="60" cy="95" rx="22" ry="28" opacity="0.9"/>
      
      {/* Tail */}
      <path d="M 82 100 Q 95 105 100 95 Q 102 90 98 85" strokeWidth="2"/>
      
      {/* Legs */}
      <line x1="48" y1="120" x2="48" y2="128" strokeWidth="2"/>
      <line x1="60" y1="120" x2="60" y2="128" strokeWidth="2"/>
      <line x1="72" y1="120" x2="72" y2="128" strokeWidth="2"/>
    </g>
  </svg>
);

export const Cat2 = () => (
  <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g stroke="#3D3D3D" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Body - sitting */}
      <ellipse cx="60" cy="85" rx="28" ry="32" opacity="0.9"/>
      
      {/* Head */}
      <circle cx="60" cy="48" r="22" opacity="0.9"/>
      
      {/* Ears */}
      <path d="M 42 35 L 38 18 L 47 32" />
      <path d="M 78 35 L 82 18 L 73 32" />
      
      {/* Eyes - closed/happy */}
      <path d="M 48 46 Q 52 49 56 46" strokeWidth="1.5"/>
      <path d="M 64 46 Q 68 49 72 46" strokeWidth="1.5"/>
      
      {/* Nose and mouth */}
      <circle cx="60" cy="54" r="2" fill="#3D3D3D"/>
      <path d="M 60 54 L 57 58" strokeWidth="1"/>
      <path d="M 60 54 L 63 58" strokeWidth="1"/>
      
      {/* Tail curled */}
      <path d="M 85 90 Q 95 80 92 70 Q 88 65 82 68" strokeWidth="2"/>
      
      {/* Front paws */}
      <ellipse cx="50" cy="115" rx="6" ry="4" opacity="0.8"/>
      <ellipse cx="70" cy="115" rx="6" ry="4" opacity="0.8"/>
    </g>
  </svg>
);

export const Dog1 = () => (
  <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g stroke="#3D3D3D" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <ellipse cx="60" cy="50" rx="24" ry="26" opacity="0.9"/>
      
      {/* Floppy ears */}
      <path d="M 38 45 Q 25 50 22 60 Q 23 65 28 62" opacity="0.9"/>
      <path d="M 82 45 Q 95 50 98 60 Q 97 65 92 62" opacity="0.9"/>
      
      {/* Eyes */}
      <circle cx="50" cy="48" r="4" fill="#3D3D3D"/>
      <circle cx="70" cy="48" r="4" fill="#3D3D3D"/>
      
      {/* Nose */}
      <ellipse cx="60" cy="58" rx="5" ry="4" fill="#3D3D3D"/>
      
      {/* Mouth */}
      <path d="M 60 58 L 60 62" strokeWidth="1"/>
      <path d="M 55 64 Q 60 67 65 64" strokeWidth="1.5"/>
      
      {/* Body */}
      <ellipse cx="60" cy="95" rx="25" ry="30" opacity="0.9"/>
      
      {/* Tail wagging */}
      <path d="M 82 85 Q 90 82 95 78" strokeWidth="2.5"/>
      
      {/* Legs */}
      <rect x="44" y="118" width="6" height="15" rx="3" opacity="0.8"/>
      <rect x="56" y="118" width="6" height="15" rx="3" opacity="0.8"/>
      <rect x="68" y="118" width="6" height="15" rx="3" opacity="0.8"/>
    </g>
  </svg>
);

export const Dog2 = () => (
  <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g stroke="#3D3D3D" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Body - playful pose */}
      <ellipse cx="65" cy="80" rx="30" ry="25" transform="rotate(-10 65 80)" opacity="0.9"/>
      
      {/* Head */}
      <circle cx="55" cy="48" r="20" opacity="0.9"/>
      
      {/* Ears pointing up */}
      <path d="M 42 38 L 38 22 L 45 35" />
      <path d="M 68 38 L 72 22 L 65 35" />
      
      {/* Eyes - happy */}
      <path d="M 46 46 Q 49 49 52 46" strokeWidth="1.5" fill="#3D3D3D"/>
      <path d="M 58 46 Q 61 49 64 46" strokeWidth="1.5" fill="#3D3D3D"/>
      
      {/* Nose */}
      <circle cx="55" cy="54" r="3" fill="#3D3D3D"/>
      
      {/* Tongue out */}
      <path d="M 55 54 L 55 62 Q 58 64 60 62" fill="#FFF" stroke="#3D3D3D"/>
      
      {/* Tail up and wagging */}
      <path d="M 88 75 Q 100 70 105 65" strokeWidth="2.5"/>
      
      {/* Legs in playful stance */}
      <line x1="50" y1="100" x2="45" y2="115" strokeWidth="2.5"/>
      <line x1="65" y1="100" x2="70" y2="115" strokeWidth="2.5"/>
      <line x1="75" y1="95" x2="80" y2="110" strokeWidth="2.5"/>
    </g>
  </svg>
);

const sketches = [Totoro1, Totoro2, Cat1, Cat2, Dog1, Dog2];

export const getRandomSketch = () => {
  const randomIndex = Math.floor(Math.random() * sketches.length);
  return sketches[randomIndex];
};

export default sketches;
