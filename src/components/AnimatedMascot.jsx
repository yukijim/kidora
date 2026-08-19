import './AnimatedMascot.css';

/**
 * Maskot singa KIDORA yang dianimasikan (SVG + CSS):
 * melambai, kelip mata, ekor bergoyang, badan beralun.
 * Diguna sebagai "video animasi" ringan dalam landing page.
 */
export default function AnimatedMascot({ className = '' }) {
  return (
    <svg
      className={`mascot ${className}`}
      viewBox="0 0 240 240"
      role="img"
      aria-label="Maskot singa KIDORA melambai"
    >
      {/* Ekor (goyang) */}
      <g className="mascot-tail">
        <path
          d="M74 176 Q52 178 46 196"
          stroke="#E5A020"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="44" cy="198" r="9" fill="#F5A623" />
      </g>

      {/* Badan */}
      <ellipse cx="118" cy="196" rx="52" ry="36" fill="#FFCB3D" />
      <ellipse cx="118" cy="202" rx="34" ry="22" fill="#FFE3A3" />

      {/* Kaki */}
      <ellipse cx="92" cy="226" rx="14" ry="9" fill="#F5A623" />
      <ellipse cx="144" cy="226" rx="14" ry="9" fill="#F5A623" />

      {/* Lengan kiri */}
      <rect x="74" y="156" width="16" height="42" rx="8" fill="#FFCB3D" />
      <circle cx="82" cy="200" r="10" fill="#FFCB3D" />

      {/* Selendang */}
      <g className="mascot-scarf">
        <path d="M82 142 Q118 156 156 142 L156 154 Q118 168 82 154 Z" fill="#E55577" />
        <path d="M144 152 L160 184 L148 186 L136 156 Z" fill="#E55577" />
      </g>

      {/* Lengan kanan (melambai) */}
      <g className="mascot-arm">
        <rect x="148" y="150" width="16" height="46" rx="8" fill="#FFCB3D" />
        <circle cx="156" cy="196" r="11" fill="#FFCB3D" />
      </g>

      {/* Surai (belakang kepala) */}
      <g fill="#F5A623">
        <circle cx="170" cy="100" r="16" />
        <circle cx="155" cy="136" r="16" />
        <circle cx="120" cy="150" r="16" />
        <circle cx="85" cy="136" r="16" />
        <circle cx="70" cy="100" r="16" />
        <circle cx="85" cy="64" r="16" />
        <circle cx="120" cy="50" r="16" />
        <circle cx="155" cy="64" r="16" />
      </g>

      {/* Kepala */}
      <circle cx="120" cy="100" r="46" fill="#FFCB3D" />

      {/* Telinga */}
      <circle cx="86" cy="58" r="13" fill="#FFCB3D" />
      <circle cx="86" cy="58" r="7" fill="#F5A623" />
      <circle cx="154" cy="58" r="13" fill="#FFCB3D" />
      <circle cx="154" cy="58" r="7" fill="#F5A623" />

      {/* Mata (kelip) */}
      <g className="mascot-eyes">
        <ellipse cx="100" cy="92" rx="12" ry="15" fill="#fff" />
        <ellipse cx="140" cy="92" rx="12" ry="15" fill="#fff" />
        <circle cx="102" cy="94" r="6" fill="#2D3748" />
        <circle cx="142" cy="94" r="6" fill="#2D3748" />
        <circle cx="104" cy="92" r="2" fill="#fff" />
        <circle cx="144" cy="92" r="2" fill="#fff" />
      </g>

      {/* Pipi */}
      <circle cx="86" cy="110" r="7" fill="#FF94AB" opacity="0.6" />
      <circle cx="154" cy="110" r="7" fill="#FF94AB" opacity="0.6" />

      {/* Muncung & hidung */}
      <ellipse cx="120" cy="112" rx="23" ry="17" fill="#FFE3A3" />
      <path d="M113 104 Q120 98 127 104 Q120 110 113 104 Z" fill="#7A4A21" />

      {/* Senyum */}
      <path
        d="M108 116 Q120 128 132 116"
        stroke="#7A4A21"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Misai */}
      <path d="M96 110 L80 106" stroke="#E5A020" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M96 114 L80 114" stroke="#E5A020" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M144 110 L160 106" stroke="#E5A020" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M144 114 L160 114" stroke="#E5A020" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
