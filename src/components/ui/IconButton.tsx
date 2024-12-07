"use client";

import React from 'react';
import { cn } from '@/lib/utils';

type IconButtonVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'default',
  active = false,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-colors",
        "h-8 w-8 p-0",
        {
          'hover:bg-gray-100': variant === 'ghost',
          'bg-white shadow-sm': active,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
