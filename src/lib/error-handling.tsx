"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorHandler: React.FC<ErrorProps> = ({ 
  message = "Une erreur est survenue", 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <AlertTriangle 
        size={64} 
        className="text-red-500 mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! {message}
      </h2>
      <p>Une erreur s&apos;est produite</p>
      {onRetry && (
        <Button 
          variant="primary" 
          onClick={onRetry}
        >
          Réessayer
        </Button>
      )}
    </div>
  );
};