import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Cyberpunk Book + Tech Circuit Integrated Icon with neon glow */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-slate-950 text-cyan-400 p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.35)] ring-1 ring-cyan-500/40 transition-transform duration-300 hover:scale-105 shrink-0 group`}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
          aria-hidden="true"
        >
          {/* Open Book Outline */}
          <path
            d="M6 31C9 30 15 29 20 32C25 29 31 30 34 31V10C31 9 25 8 20 11C15 8 9 9 6 10V31Z"
            stroke="#f1f5f9"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Book Spine with Neon Glow */}
          <path
            d="M20 11V32"
            stroke="#00f0ff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Integrated Tech Circuit Traces Left Page */}
          <path
            d="M10 16H14L16 19"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="10" cy="16" r="1.5" fill="#38bdf8" />
          
          <path
            d="M10 24H13L15 22"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="10" cy="24" r="1.5" fill="#38bdf8" />

          {/* Integrated Tech Chip & Digital Nodes Right Page */}
          <path
            d="M30 16H26L24 19"
            stroke="#a855f7"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="30" cy="16" r="1.5" fill="#a855f7" />

          <path
            d="M30 24H27L25 22"
            stroke="#a855f7"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="30" cy="24" r="1.5" fill="#a855f7" />

          {/* Central Microchip Core */}
          <rect
            x="18"
            y="17"
            width="4"
            height="4"
            rx="1"
            fill="#00f0ff"
            className="animate-pulse"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-black tracking-tight text-white whitespace-nowrap shrink-0 ${textSizes[size]}`}
        >
          belajarBareng<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">Sitty</span>
        </span>
      )}
    </div>
  );
};
