import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 p-6 ${className}`}>
      {title && (
        <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      )}
      {children}
    </div>
  );
};
