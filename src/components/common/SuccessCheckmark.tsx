import React from 'react';

interface SuccessCheckmarkProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const SuccessCheckmark: React.FC<SuccessCheckmarkProps> = ({
  size = 64,
  strokeWidth = 3.5,
  className = 'text-emerald-500',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center animate-checkmark-pop ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Soft pulse glow behind */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-500/25 blur-lg animate-pulse" />

      <svg
        className="relative w-full h-full"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="animate-checkmark-circle"
          cx="26"
          cy="26"
          r="23"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          className="animate-checkmark-check"
          d="M16 26.5L23 33.5L36 19.5"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
