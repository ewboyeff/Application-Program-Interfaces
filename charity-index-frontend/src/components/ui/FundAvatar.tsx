import React from 'react';
import { cn } from '@/src/lib/utils';

interface FundAvatarProps {
  initials: string;
  color: string;
  imageUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const FundAvatar: React.FC<FundAvatarProps> = ({ initials, color, imageUrl, size = 'md', className }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  if (imageUrl) {
    return (
      <div
        className={cn('rounded-full overflow-hidden border-2 shrink-0', sizeClasses[size], className)}
        style={{ borderColor: `${color}4D` }}
      >
        <img src={imageUrl} alt={initials} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold uppercase border-2 shrink-0',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${color}26`,
        borderColor: `${color}4D`,
        color: color,
      }}
    >
      {initials}
    </div>
  );
};
