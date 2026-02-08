import React from 'react';

const BonsaiAnimation = ({ visible, className = '', delayOffset = 0 }) => {
  const d = delayOffset;

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 260 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* === POT — wide, shallow bowl shape === */}
        {/* Pot rim — wide flat top */}
        <path
          d="M55 248 L205 248"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d}s` }}
        />
        {/* Pot bowl — curved bottom */}
        <path
          d="M60 248 C65 268, 85 280, 130 280 C175 280, 195 268, 200 248"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 0.12}s` }}
        />

        {/* === TRUNK — thick S-curve, starts center-right, leans right === */}
        {/* Main trunk — wide at base, dramatic S-curve */}
        <path
          d="M120 246 C118 236, 112 226, 108 218 C102 206, 98 196, 100 186 C102 176, 110 168, 118 160 C126 152, 134 144, 138 136 C142 128, 140 120, 138 112"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="5"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 0.25}s` }}
        />
        {/* Trunk right edge (thickness) */}
        <path
          d="M126 246 C124 237, 119 228, 116 220 C111 210, 108 200, 109 192 C110 184, 116 176, 122 169"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 0.45}s` }}
        />

        {/* === BRANCHES — visible between foliage pads === */}
        {/* Branch 1 — lower left, reaches left and slightly down */}
        <path
          d="M104 192 C94 188, 82 184, 68 182 C58 181, 48 182, 38 180"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2.2"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 0.8}s` }}
        />
        {/* Branch 2 — lower right, long reach */}
        <path
          d="M108 186 C118 180, 132 176, 148 173 C162 170, 176 170, 190 167"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 0.88}s` }}
        />
        {/* Branch 3 — mid left */}
        <path
          d="M112 165 C102 160, 88 155, 72 152"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.6"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 0.95}s` }}
        />
        {/* Branch 4 — mid right */}
        <path
          d="M132 148 C142 142, 156 138, 170 134 C180 131, 188 130, 196 127"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.6"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 1.0}s` }}
        />
        {/* Branch 5 — upper left (small) */}
        <path
          d="M128 136 C118 130, 106 126, 92 124"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.3"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 1.05}s` }}
        />
        {/* Apex branch — continues trunk upward-right */}
        <path
          d="M138 112 C140 104, 144 96, 142 88"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.3"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 1.08}s` }}
        />

        {/* === FOLIAGE PADS — round, puffy cloud shapes with bumpy outlines === */}
        {/* Lower-left pad */}
        <path
          d="M42 182 C34 178, 22 174, 18 166 C14 158, 18 150, 26 147 C34 144, 44 146, 52 150 C58 148, 64 146, 70 148 C78 150, 82 156, 78 163 C74 170, 64 176, 54 180 C48 182, 42 184, 42 182"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 1.2}s` }}
        />
        {/* Lower-right pad (large) */}
        <path
          d="M170 170 C180 164, 196 160, 204 152 C212 144, 210 134, 200 130 C192 127, 182 128, 174 132 C166 130, 156 130, 150 134 C142 138, 140 146, 144 154 C148 162, 158 168, 166 172 C170 174, 174 172, 170 170"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 1.25}s` }}
        />
        {/* Mid-left pad (smaller) */}
        <path
          d="M74 154 C66 150, 54 147, 50 140 C46 133, 52 126, 60 124 C68 122, 78 124, 84 128 C90 126, 96 126, 100 130 C104 134, 102 140, 96 146 C90 152, 80 155, 74 154"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 1.32}s` }}
        />
        {/* Mid-right pad (large) */}
        <path
          d="M174 136 C184 130, 200 126, 208 118 C216 110, 212 100, 202 96 C192 92, 180 94, 172 98 C164 94, 154 94, 148 100 C140 106, 140 114, 146 122 C152 130, 164 136, 174 136"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 1.36}s` }}
        />
        {/* Upper-left pad (small) */}
        <path
          d="M94 126 C86 122, 76 118, 72 112 C68 106, 72 98, 80 96 C88 94, 96 96, 102 100 C106 98, 112 98, 114 102 C118 108, 114 116, 106 122 C100 126, 94 128, 94 126"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 1.4}s` }}
        />
        {/* Apex / crown pad (top, largest, right-of-center) */}
        <path
          d="M130 92 C120 86, 114 76, 118 66 C122 56, 132 50, 144 50 C152 48, 162 50, 168 56 C176 54, 184 58, 186 66 C188 74, 182 82, 172 88 C162 94, 148 96, 138 94 C134 94, 130 93, 130 92"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeLinecap="round"
          pathLength="1"
          className={`bonsai-draw ${visible ? 'bonsai-animate' : ''}`}
          style={{ animationDelay: `${d + 1.46}s` }}
        />

        {/* === BLOSSOMS — crimson, clustered on pads === */}
        {/* Lower-left pad */}
        <circle cx="30" cy="156" r="4" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.0}s` }} />
        <circle cx="48" cy="152" r="3" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.1}s` }} />
        <circle cx="62" cy="156" r="2.5" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.18}s` }} />

        {/* Lower-right pad */}
        <circle cx="198" cy="140" r="4.5" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.05}s` }} />
        <circle cx="180" cy="136" r="3.5" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.15}s` }} />
        <circle cx="162" cy="142" r="3" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.25}s` }} />
        <circle cx="190" cy="155" r="3" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.2}s` }} />

        {/* Mid-left pad */}
        <circle cx="60" cy="132" r="3" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.22}s` }} />
        <circle cx="78" cy="130" r="2.5" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.32}s` }} />

        {/* Mid-right pad */}
        <circle cx="200" cy="104" r="4" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.3}s` }} />
        <circle cx="182" cy="100" r="3.5" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.4}s` }} />
        <circle cx="162" cy="104" r="3" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.35}s` }} />

        {/* Upper-left pad */}
        <circle cx="82" cy="102" r="3" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.42}s` }} />
        <circle cx="98" cy="104" r="2.5" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.48}s` }} />

        {/* Apex / crown */}
        <circle cx="148" cy="58" r="4.5" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.5}s` }} />
        <circle cx="168" cy="64" r="3.5" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.6}s` }} />
        <circle cx="132" cy="66" r="3" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.55}s` }} />
        <circle cx="158" cy="76" r="3" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.68}s` }} />
        <circle cx="178" cy="78" r="2.5" fill="#C41E3A"
          className={`bonsai-blossom ${visible ? 'bonsai-bloom' : ''}`} style={{ animationDelay: `${d + 2.72}s` }} />
      </svg>
    </div>
  );
};

export default BonsaiAnimation;
