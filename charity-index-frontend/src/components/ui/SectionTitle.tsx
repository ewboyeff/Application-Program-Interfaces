import React from 'react';
import { cn } from '@/src/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, centered, className }) => {
  return (
    <div className={cn('mb-10', centered && 'text-center', className)}>
      <h2 className="text-2xl md:text-[28px] font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-2 max-w-2xl mx-auto">{subtitle}</p>}
      <div
        className={cn(
          'w-12 h-1 bg-primary-600 rounded-full mt-3',
          centered && 'mx-auto'
        )}
      />
    </div>
  );
};
