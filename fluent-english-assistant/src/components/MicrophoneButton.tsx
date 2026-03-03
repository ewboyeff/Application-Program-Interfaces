import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MicrophoneButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const MicrophoneButton = ({
  isListening,
  isProcessing,
  onStart,
  onStop,
  disabled = false,
}: MicrophoneButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isListening ? onStop : onStart}
        disabled={disabled || isProcessing}
        className={cn(
          "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
          "focus:outline-none focus:ring-4 focus:ring-primary/30",
          isListening
            ? "bg-destructive text-destructive-foreground animate-pulse-glow"
            : "bg-primary text-primary-foreground hover:scale-105 hover:shadow-lg",
          (disabled || isProcessing) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isListening ? (
          <Square className="w-12 h-12" />
        ) : (
          <Mic className="w-12 h-12" />
        )}
        
        {isListening && (
          <div className="absolute inset-0 rounded-full border-4 border-destructive/50 animate-ping" />
        )}
      </button>
      
      <p className="text-muted-foreground text-sm font-medium">
        {isProcessing 
          ? "Processing..." 
          : isListening 
            ? "Tap to stop recording" 
            : "Tap to start speaking"}
      </p>
    </div>
  );
};
