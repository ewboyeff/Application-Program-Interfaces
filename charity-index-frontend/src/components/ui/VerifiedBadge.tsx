import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

interface VerifiedBadgeProps {
  isVerified: boolean;
  className?: string;
  showText?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ isVerified, className, showText = true }) => {
  const { t } = useTranslation('common');
  if (!isVerified) return null;

  return (
    <div className={cn('text-emerald-600 text-[12px] font-bold flex items-center gap-1 uppercase tracking-tight', className)}>
      <CheckCircle2 className="w-3.5 h-3.5" />
      {showText && <span>{t('verified')}</span>}
    </div>
  );
};
