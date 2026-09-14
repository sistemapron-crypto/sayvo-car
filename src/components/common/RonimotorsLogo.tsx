import React from 'react';

interface RonimotorsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const RonimotorsLogo: React.FC<RonimotorsLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconDimensions = {
    sm: { width: 34, height: 32 },
    md: { width: 44, height: 40 },
    lg: { width: 56, height: 50 },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Stylized Ronimotors 'R' Emblem matching reference */}
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox="0 0 120 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
      >
        {/* Left deep dark-slate angled stem */}
        <path
          d="M26 10L10 100H28L42 28H56L46 10H26Z"
          fill="#475569"
        />
        {/* Main 3D Blue 'R' loop and leg */}
        <path
          d="M40 10H86C104 10 114 22 108 42C103 57 88 64 72 65L96 100H74L52 66H42L36 100H18L34 10H40Z"
          fill="#1D4ED8"
        />
        {/* Inner cutout of the R */}
        <path
          d="M52 26L48 50H72C80 50 86 46 88 38C90 30 84 26 76 26H52Z"
          fill="#FFFFFF"
        />
        {/* Stylized bevel highlight */}
        <path
          d="M72 65L96 100H74L56 72L72 65Z"
          fill="#1E40AF"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold text-slate-900 tracking-tight text-xl md:text-2xl font-sans">
            Ronimotors
          </span>
          <span className="text-[10px] md:text-[11px] font-semibold tracking-wider text-slate-500 uppercase -mt-0.5">
            automóveis
          </span>
        </div>
      )}
    </div>
  );
};
