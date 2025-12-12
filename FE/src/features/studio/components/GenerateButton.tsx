import React from 'react';
import { Button } from '@/shared/components/ui/button';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'settings' | 'chat';
}

export function GenerateButton({ onClick, disabled = false, variant = 'settings' }: GenerateButtonProps) {
  if (variant === 'chat') {
    return (
      <div className="text-center space-y-3">
        <p className="text-sm text-gray-600 font-medium">
          Ready to bring your story to life?
        </p>
        <Button
          onClick={onClick}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm h-11"
        >
          Generate Story
        </Button>
      </div>
    );
  }

  // Settings variant - clean and minimal design
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
      size="lg"
    >
      Generate Story
    </Button>
  );
}

