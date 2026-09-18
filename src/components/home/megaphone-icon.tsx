"use client";

export function MegaphoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Main cone gradient - blue to purple */}
        <linearGradient id="cone-grad" x1="30" y1="30" x2="100" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        {/* Cone inner shadow */}
        <linearGradient id="cone-inner" x1="90" y1="40" x2="105" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        {/* Handle gradient - orange to pink */}
        <linearGradient id="handle-grad" x1="20" y1="55" x2="45" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
        {/* Glow */}
        <radialGradient id="glow" cx="75" cy="55" r="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
        </radialGradient>
        {/* Soft shadow */}
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#7C3AED" floodOpacity="0.2" />
        </filter>
        {/* Inner highlight */}
        <linearGradient id="highlight" x1="40" y1="30" x2="60" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Ambient glow */}
      <circle cx="70" cy="55" r="45" fill="url(#glow)" />

      {/* Main megaphone group */}
      <g filter="url(#soft-shadow)">
        {/* Cone body */}
        <path
          d="M38 42 L95 28 C100 26 104 30 104 35 L104 75 C104 80 100 84 95 82 L38 68 Z"
          fill="url(#cone-grad)"
        />

        {/* Cone opening (dark interior) */}
        <ellipse cx="100" cy="55" rx="8" ry="22" fill="url(#cone-inner)" />

        {/* Cone rim highlight */}
        <ellipse cx="100" cy="55" rx="6" ry="18" fill="none" stroke="#E0E7FF" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Cone surface highlight */}
        <path
          d="M42 44 L92 32 C94 31 95 33 95 35 L95 50 L42 58 Z"
          fill="url(#highlight)"
        />

        {/* Handle / grip */}
        <rect x="22" y="52" width="22" height="14" rx="5" fill="url(#handle-grad)" />

        {/* Handle highlight */}
        <rect x="24" y="54" width="18" height="4" rx="2" fill="white" fillOpacity="0.3" />

        {/* Button on handle */}
        <circle cx="33" cy="59" r="3" fill="#FB923C" stroke="#F97316" strokeWidth="1" />

        {/* Sound waves */}
        <g opacity="0.6">
          <path d="M108 42 C112 42 114 48 114 55 C114 62 112 68 108 68" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M112 36 C118 38 122 46 122 55 C122 64 118 72 112 74" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
        </g>
      </g>
    </svg>
  );
}
