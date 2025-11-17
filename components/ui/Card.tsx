import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={`bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};