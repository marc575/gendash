"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'>  {
  label?: string;
  error?: string;
  className?: string;
  prefix?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  prefix,
  ...props
}) => {
  return (
  <div className="w-full">
    {label && (
      <label 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
    )}
    <div className="relative">
      {prefix && ( // ajout du rendu du prefix
        <div className="absolute top-1/2 transform -translate-y-1/2 right-3">
          {prefix}
        </div>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'text-gray-900 bg-white',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-500">{error}</p>
    )}
  </div>
  );
};