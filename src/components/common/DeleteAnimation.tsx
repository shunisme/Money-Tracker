import React from 'react';

interface DeleteAnimationProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const DeleteAnimation: React.FC<DeleteAnimationProps> = ({
  size = 64,
  strokeWidth = 3.5,
  className = 'text-rose-500',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center animate-delete-pop ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Soft pulse glow behind */}
      <div className="absolute inset-0 rounded-full bg-rose-500/20 dark:bg-rose-500/25 blur-lg animate-pulse" />

      <svg
        className="relative w-full h-full"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated Circle */}
        <circle
          className="animate-checkmark-circle"
          cx="26"
          cy="26"
          r="23"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Animated Cross Lines */}
        <line
          className="animate-crossmark-line1"
          x1="18"
          y1="18"
          x2="34"
          y2="34"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          className="animate-crossmark-line2"
          x1="34"
          y1="18"
          x2="18"
          y2="34"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
