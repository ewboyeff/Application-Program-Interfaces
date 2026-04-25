import React from 'react';
import { cn } from '@/src/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("animate-pulse bg-slate-200 rounded", className)} />
  );
};

export const FundCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-100 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
        <div className="space-y-1">
          <Skeleton className="h-3 w-12 mx-auto" />
          <Skeleton className="h-5 w-16 mx-auto" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-12 mx-auto" />
          <Skeleton className="h-5 w-16 mx-auto" />
        </div>
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
};
