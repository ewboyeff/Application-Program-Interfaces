import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { MicrophoneButton } from '@/components/MicrophoneButton';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { ProcessingStep } from '@/components/ProcessingStep';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type StepStatus = 'pending' | 'processing' | 'completed' | 'error';

interface ProcessingState {
  transcriptStatus: StepStatus;
  promptStatus: StepStatus;
  imageStatus: StepStatus;
  transcript: string;
  generatedPrompt: string;
  generatedImage: string;
}

const Index = () => {
  const { toast } = useToast();
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error: speechError,
  } = useSpeechRecognition();

  const [isProcessing, setIsProcessing] = useState(false);
  const [state, setState] = useState<ProcessingState>({
    transcriptStatus: 'pending',
    promptStatus: 'pending',
    imageStatus: 'pending',
    transcript: '',
    generatedPrompt: '',
    generatedImage: '',
  });

  const resetState = () => {
    setState({
      transcriptStatus: 'pending',
      promptStatus: 'pending',
      imageStatus: 'pending',
      transcript: '',
      generatedPrompt: '',
      generatedImage: '',
    });
    resetTranscript();
  };

  const handleStart = () => {
    resetState();
    startListening();
    setState(prev => ({ ...prev, transcriptStatus: 'processing' }));
  };

  const handleStop = async () => {
    stopListening();
    
    const finalTranscript = transcript.trim();
    
    if (!finalTranscript) {
      toast({
        title: "No speech detected",
        description: "Please try speaking again.",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, transcriptStatus: 'pending' }));
      return;
    }

    setState(prev => ({
      ...prev,
      transcriptStatus: 'completed',
      transcript: finalTranscript,
      promptStatus: 'processing',
    }));

    setIsProcessing(true);

    try {
      // Step 1: Generate image prompt from transcript
      const { data: promptData, error: promptError } = await supabase.functions.invoke(
        'generate-image-prompt',
        { body: { transcript: finalTranscript } }
      );

      if (promptError) throw promptError;

      const generatedPrompt = promptData.prompt;
      
      setState(prev => ({
        ...prev,
        promptStatus: 'completed',
        generatedPrompt,
        imageStatus: 'processing',
      }));

      // Step 2: Generate image from prompt
      const { data: imageData, error: imageError } = await supabase.functions.invoke(
        'generate-image',
        { body: { prompt: generatedPrompt } }
      );

      if (imageError) throw imageError;

      setState(prev => ({
        ...prev,
        imageStatus: 'completed',
        generatedImage: imageData.imageUrl,
      }));

      toast({
        title: "Image generated!",
        description: "Your voice has been transformed into an image.",
      });
    } catch (error) {
      console.error('Processing error:', error);
      
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });

      setState(prev => ({
        ...prev,
        promptStatus: prev.promptStatus === 'processing' ? 'error' : prev.promptStatus,
        imageStatus: prev.imageStatus === 'processing' ? 'error' : prev.imageStatus,
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Voice to Image</h1>
              <p className="text-sm text-muted-foreground">Speak in English, see your imagination</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Browser Support Warning */}
        {!isSupported && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
            </AlertDescription>
          </Alert>
        )}

        {/* Speech Error */}
        {speechError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Speech recognition error: {speechError}
            </AlertDescription>
          </Alert>
        )}

        {/* Microphone Section */}
        <section className="flex flex-col items-center py-8 mb-8">
          <AudioVisualizer isActive={isListening} />
          <div className="mt-6">
            <MicrophoneButton
              isListening={isListening}
              isProcessing={isProcessing}
              onStart={handleStart}
              onStop={handleStop}
              disabled={!isSupported}
            />
          </div>
          
          {/* Live transcript preview */}
          {isListening && transcript && (
            <div className="mt-6 w-full max-w-md">
              <p className="text-ceonter text-muted-foreground text-sm mb-2">Hearing:</p>
              <p className="text-center font-medium bg-muted/50 p-4 rounded-lg">
                {transcript}
              </p>
            </div>
          )}
        </section>

        {/* Processing Steps */}
        <section className="space-y-4">
          <ProcessingStep
            stepNumber={1}
            title="Speech to Text"
            status={state.transcriptStatus}
            content={state.transcript}
          />
          
          <ProcessingStep
            stepNumber={2}
            title="Generated Prompt"
            status={state.promptStatus}
            content={state.generatedPrompt}
          />
          
          <ProcessingStep
            stepNumber={3}
            title="Generated Image"
            status={state.imageStatus}
            content={state.generatedImage}
            isImageStep
          />
        </section>
      </main>
    </div>
  );
};

export default Index;
