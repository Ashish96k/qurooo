/** Cute QR mascot for the Pro Tip card — matched to the design mockup. */
export function ProTipMascot({ className = "" }: { className?: string }) {
  const gid = "protip-mascot-body";

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="28" y1="14" x2="28" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CFFAFE" />
          <stop offset="0.4" stopColor="#7DD3FC" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="50" cy="90" rx="20" ry="3.8" fill="rgba(56,189,248,0.22)" />

      {/* Legs + shoes (behind body slightly) */}
      <path d="M41 70 V82" stroke="#1A1F2C" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M59 70 V82" stroke="#1A1F2C" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="41" cy="84.5" rx="5.5" ry="2.6" fill="#1A1F2C" />
      <ellipse cx="59" cy="84.5" rx="5.5" ry="2.6" fill="#1A1F2C" />

      {/* Left arm (viewer left) hanging by side */}
      <path
        d="M30 40 C22 44 18 54 22 62"
        stroke="#1A1F2C"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Simple hand */}
      <path
        d="M20 62 C18 64 19 67 22 66 M22 66 C24 68 26 66 25 64"
        stroke="#1A1F2C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right arm pointing up-right */}
      <path
        d="M70 38 C78 32 84 22 82 12"
        stroke="#1A1F2C"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Pointing hand */}
      <path
        d="M82 12 L82 6 M82 12 L78 9 M82 12 L86 9"
        stroke="#1A1F2C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Square QR body */}
      <rect x="28" y="16" width="44" height="54" rx="9" fill={`url(#${gid})`} />

      {/* QR finder patterns — dark blue like the mockup */}
      <g fill="#0C4A6E">
        {/* TL */}
        <rect x="31.5" y="19.5" width="11" height="11" rx="1.6" />
        <rect x="33.3" y="21.3" width="7.4" height="7.4" rx="1.1" fill="#E0F2FE" />
        <rect x="35" y="23" width="4" height="4" rx="0.7" fill="#0C4A6E" />
        {/* TR */}
        <rect x="57.5" y="19.5" width="11" height="11" rx="1.6" />
        <rect x="59.3" y="21.3" width="7.4" height="7.4" rx="1.1" fill="#E0F2FE" />
        <rect x="61" y="23" width="4" height="4" rx="0.7" fill="#0C4A6E" />
        {/* BL */}
        <rect x="31.5" y="55.5" width="11" height="11" rx="1.6" />
        <rect x="33.3" y="57.3" width="7.4" height="7.4" rx="1.1" fill="#E0F2FE" />
        <rect x="35" y="59" width="4" height="4" rx="0.7" fill="#0C4A6E" />
      </g>

      {/* Dense QR modules */}
      <g fill="#075985" fillOpacity="0.88">
        <rect x="45.5" y="20.5" width="2.6" height="2.6" rx="0.4" />
        <rect x="49.5" y="20.5" width="2.6" height="2.6" rx="0.4" />
        <rect x="53.5" y="20.5" width="2.6" height="2.6" rx="0.4" />
        <rect x="45.5" y="24.5" width="2.6" height="2.6" rx="0.4" />
        <rect x="53.5" y="24.5" width="2.6" height="2.6" rx="0.4" />
        <rect x="49.5" y="28.5" width="2.6" height="2.6" rx="0.4" />
        <rect x="45.5" y="32.5" width="2.6" height="2.6" rx="0.4" />
        <rect x="65" y="33" width="2.6" height="2.6" rx="0.4" />
        <rect x="32" y="33" width="2.6" height="2.6" rx="0.4" />
        <rect x="65" y="45" width="2.6" height="2.6" rx="0.4" />
        <rect x="65" y="49" width="2.6" height="2.6" rx="0.4" />
        <rect x="61" y="53" width="2.6" height="2.6" rx="0.4" />
        <rect x="65" y="57" width="2.6" height="2.6" rx="0.4" />
        <rect x="57" y="61" width="2.6" height="2.6" rx="0.4" />
        <rect x="61" y="61" width="2.6" height="2.6" rx="0.4" />
        <rect x="49.5" y="61" width="2.6" height="2.6" rx="0.4" />
        <rect x="45.5" y="57" width="2.6" height="2.6" rx="0.4" />
        <rect x="53.5" y="57" width="2.6" height="2.6" rx="0.4" />
      </g>

      {/* Face — large eyes, pink smile */}
      <circle cx="43" cy="42" r="3.4" fill="#1A1F2C" />
      <circle cx="57" cy="42" r="3.4" fill="#1A1F2C" />
      <circle cx="44.1" cy="41" r="1.05" fill="white" />
      <circle cx="58.1" cy="41" r="1.05" fill="white" />

      {/* Nose */}
      <path d="M50 46.5 L48.4 49.2 H51.6 Z" fill="#0C4A6E" />

      {/* Open smile with tongue */}
      <path
        d="M42.5 52.2 C45.5 57.8 54.5 57.8 57.5 52.2"
        fill="#1A1F2C"
      />
      <path
        d="M44.2 52.6 C46.8 56.4 53.2 56.4 55.8 52.6"
        fill="#FBCFE8"
      />
      <ellipse cx="50" cy="54.6" rx="3.2" ry="1.6" fill="#FB7185" />

      {/* Sparkles */}
      <path
        d="M14 34 L15.4 37.4 L18.8 38.8 L15.4 40.2 L14 43.6 L12.6 40.2 L9.2 38.8 L12.6 37.4 Z"
        fill="#2DD4BF"
      />
      <path
        d="M84 28 L85.1 30.8 L87.9 31.9 L85.1 33 L84 35.8 L82.9 33 L80.1 31.9 L82.9 30.8 Z"
        fill="#5EEAD4"
      />
      <path
        d="M88 48 L88.9 50.2 L91.1 51.1 L88.9 52 L88 54.2 L87.1 52 L84.9 51.1 L87.1 50.2 Z"
        fill="#2DD4BF"
      />
      <path
        d="M76 8 L77 10.4 L79.4 11.4 L77 12.4 L76 14.8 L75 12.4 L72.6 11.4 L75 10.4 Z"
        fill="#5EEAD4"
      />
    </svg>
  );
}
