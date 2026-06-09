import React from 'react';
import { cn, getScoreColor, getScoreBg } from '@/src/lib/utils';

interface ScoreDisplayProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, size = 'md', className }) => {
  const colorClass = getScoreColor(score);
  const bgClass = getScoreBg(score);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-2xl font-bold',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('rounded-full', bgClass, dotSizes[size])} />
      <span className={cn(colorClass, sizeClasses[size])}>{score}</span>
    </div>
  );
};
