import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  isActive: boolean;
}

export const AudioVisualizer = ({ isActive }: AudioVisualizerProps) => {
  const bars = 12;
  
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 bg-primary rounded-full transition-all duration-150",
            isActive ? "animate-wave" : "h-2"
          )}
          style={{
            height: isActive ? `${Math.random() * 48 + 16}px` : '8px',
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};
