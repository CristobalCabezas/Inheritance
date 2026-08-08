import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 36,
  showText = true,
  textClassName = 'text-primary dark:text-inverse-primary text-xl font-bold tracking-tight',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00236f" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="logo-accent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Shield / Scale Base */}
        <rect width="48" height="48" rx="12" fill="url(#logo-gradient-blue)" />
        <rect x="1.5" y="1.5" width="45" height="45" rx="10.5" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.25" />

        {/* Justice scale central pillar & base */}
        <path d="M24 10V36" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 36H32" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="10" r="2.5" fill="#38bdf8" />

        {/* Scale beam with slight dynamic angle */}
        <path d="M11 16L24 13L37 16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Left balance pan (Calculator / percentage sign) */}
        <path d="M11 16V21" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M6 21C6 24.5 16 24.5 16 21H6Z" fill="#38bdf8" fillOpacity="0.9" />

        {/* Right balance pan (Assets / distribution) */}
        <path d="M37 16V21" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M32 21C32 24.5 42 24.5 42 21H32Z" fill="#38bdf8" fillOpacity="0.9" />

        {/* Subtle calculation symbol accents */}
        <circle cx="16" cy="30" r="1.5" fill="#38bdf8" />
        <circle cx="32" cy="30" r="1.5" fill="#38bdf8" />
        <path d="M19 32L29 28" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.5 1.5" />
      </svg>

      {showText && (
        <span className={`font-headline-md leading-none ${textClassName}`}>
          Calcula Tu Herencia
        </span>
      )}
    </div>
  );
};
