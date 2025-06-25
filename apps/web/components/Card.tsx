import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-xl p-8 ${className}`}>
    {children}
  </div>
);

export default Card; 