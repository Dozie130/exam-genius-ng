
import React from 'react';
import { BookOpen } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner = ({ message = "Loading...", size = 'medium' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] py-12">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
        <BookOpen className={`${sizeClasses[size]} absolute inset-0 text-blue-600 animate-pulse`} />
      </div>
      <p className="mt-4 text-lg text-gray-600 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
