import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, trend, className }) => {
  return (
    <div className={cn('bg-white p-5 rounded-xl shadow-card transition-all hover:shadow-card-hover', className)}>
      <div className="flex items-start justify-between">
        <div className="bg-primary-50 p-2.5 rounded-lg">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
};
