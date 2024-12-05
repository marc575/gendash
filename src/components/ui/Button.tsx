"use client";

import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', 
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = cn(
    'rounded-lg transition-all duration-300 flex items-center justify-center gap-2',
    'focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2',
    
    // Variants
    variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    variant === 'secondary' && 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    variant === 'ghost' && 'bg-transparent text-blue-600 hover:bg-blue-50',
    variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    
    // Sizes
    size === 'sm' && 'px-2 py-1 text-xs',
    size === 'md' && 'px-4 py-2 text-sm',
    size === 'lg' && 'px-6 py-3 text-base',
    
    // Disabled state
    'disabled:opacity-50 disabled:cursor-not-allowed',
    
    className
  );

  return (
    <button 
      className={baseStyles} 
      {...props}
    >
      {children}
    </button>
  );
};