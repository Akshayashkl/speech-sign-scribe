
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, RefreshCw } from "lucide-react";
import { speechRecognizer, SpeechRecognitionResult } from "@/utils/speechUtils";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface SpeechRecognitionProps {
  language: string;
  onTranscriptChange: (transcript: string) => void;
  className?: string;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({
  language,
  onTranscriptChange,
  className = "",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsSupported(speechRecognizer.isSupported());
  }, []);

  useEffect(() => {
    return () => {
      if (isListening) {
        speechRecognizer.stopListening();
      }
    };
  }, [isListening]);

  const handleStartListening = () => {
    setIsProcessing(true);
    const success = speechRecognizer.startListening({
      language,
      onResult: (result: SpeechRecognitionResult) => {
        setTranscript(result.transcript);
        onTranscriptChange(result.transcript);
      },
      onEnd: () => {
        setIsListening(false);
        setIsProcessing(false);
      },
      onError: (error) => {
        console.error("Speech recognition error:", error);
        toast({
          title: "Speech Recognition Error",
          description: typeof error === "string" ? error : "An error occurred during speech recognition",
          variant: "destructive",
        });
        setIsListening(false);
        setIsProcessing(false);
      },
    });

    if (success) {
      setIsListening(true);
    } else {
      setIsProcessing(false);
    }
  };

  const handleStopListening = () => {
    speechRecognizer.stopListening();
    setIsListening(false);
  };

  const handleClearTranscript = () => {
    setTranscript("");
    onTranscriptChange("");
  };

  if (!isSupported) {
    return (
      <Card className={cn("border border-red-200", className)}>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-2">Speech recognition is not supported in your browser.</p>
            <p className="text-sm text-muted-foreground">Please try using Chrome, Edge, or Safari.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Speech Recognition</h2>
        <div className="flex gap-2">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            className={cn(
              "rounded-full transition-all duration-300 ease-in-out", 
              isListening ? "w-[120px]" : "w-[100px]"
            )}
            onClick={isListening ? handleStopListening : handleStartListening}
            disabled={isProcessing && !isListening}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                {isProcessing ? "Starting..." : "Start"}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleClearTranscript}
            disabled={!transcript}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className={cn(
        "border transition-all duration-300", 
        isListening ? "border-primary animate-pulse" : "",
        !transcript ? "h-[100px]" : ""
      )}>
        <CardContent className={cn(
          "p-4 min-h-[100px] relative",
          isListening ? "active-recording" : ""
        )}>
          {transcript ? (
            <p className="text-sm leading-relaxed">{transcript}</p>
          ) : (
            <p className="text-sm text-muted-foreground text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4">
              {isListening 
                ? "Listening... Start speaking" 
                : "Click the Start button and speak to see transcription here"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeechRecognition;
