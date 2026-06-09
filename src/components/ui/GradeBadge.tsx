import React from 'react';
import { cn, getGradeConfig, type Grade } from '@/src/lib/utils';

interface GradeBadgeProps {
  grade: Grade;
  className?: string;
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({ grade, className }) => {
  const config = getGradeConfig(grade);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold tracking-[0.5px] border transition-colors',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};
