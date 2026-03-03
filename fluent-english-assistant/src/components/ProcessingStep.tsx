import { Check, Loader2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StepStatus = 'pending' | 'processing' | 'completed' | 'error';

interface ProcessingStepProps {
  stepNumber: number;
  title: string;
  status: StepStatus;
  content?: string | React.ReactNode;
  isImageStep?: boolean;
}

export const ProcessingStep = ({
  stepNumber,
  title,
  status,
  content,
  isImageStep = false,
}: ProcessingStepProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-success" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'error':
        return <Circle className="w-5 h-5 text-destructive" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        status === 'processing' && "ring-2 ring-primary/50 shadow-lg",
        status === 'completed' && "border-success/30 bg-success/5",
        status === 'pending' && "opacity-60"
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <span className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
            status === 'completed' 
              ? "bg-success text-success-foreground"
              : status === 'processing'
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
          )}>
            {stepNumber}
          </span>
          <span className="flex-1">{title}</span>
          {getStatusIcon()}
        </CardTitle>
      </CardHeader>
      
      {(content || status === 'processing') && (
        <CardContent>
          {status === 'processing' && !content ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : isImageStep && typeof content === 'string' ? (
            <div className="rounded-lg overflow-hidden bg-muted">
              <img 
                src={content} 
                alt="Generated image" 
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          ) : (
            <div className="font-mono text-sm bg-muted/50 p-4 rounded-lg whitespace-pre-wrap break-words">
              {content}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
