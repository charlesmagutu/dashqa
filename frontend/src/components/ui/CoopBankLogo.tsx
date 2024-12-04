import React from 'react';

interface LogoProps {
  className?: string;
}

export const CoopBankLogo: React.FC<LogoProps> = ({ className = '' }) => (
  <svg
    viewBox="0 0 240 100"
    className={className}
    role="img"
    aria-label="Co-op Bank Logo"
  >
    <path
      fill="currentColor"
      d="M40,20 h160 a20,20 0 0 1 20,20 v20 a20,20 0 0 1 -20,20 h-160 a20,20 0 0 1 -20,-20 v-20 a20,20 0 0 1 20,-20 z"
      strokeWidth="0"
    />
    <path
      fill="white"
      d="M60,35 h120 a10,10 0 0 1 10,10 v10 a10,10 0 0 1 -10,10 h-120 a10,10 0 0 1 -10,-10 v-10 a10,10 0 0 1 10,-10 z"
      strokeWidth="0"
    />
  </svg>
);