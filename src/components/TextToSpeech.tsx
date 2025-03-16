
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  getAvailableVoices, 
  synthesizeSpeech, 
  isSpeechSynthesisSupported 
} from "@/utils/speechUtils";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface TextToSpeechProps {
  text: string;
  language: string;
  className?: string;
  onTextChange?: (text: string) => void;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  language,
  className = "",
  onTextChange,
}) => {
  const [inputText, setInputText] = useState(text);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setInputText(text);
  }, [text]);

  useEffect(() => {
    setIsSupported(isSpeechSynthesisSupported());
    
    if (isSpeechSynthesisSupported()) {
      const loadVoices = async () => {
        const availableVoices = await getAvailableVoices();
        setVoices(availableVoices);
        
        // Find a voice that matches the selected language
        const langVoice = availableVoices.find(voice => voice.lang.startsWith(language));
        if (langVoice) {
          setSelectedVoice(langVoice.name);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };
      
      loadVoices();
    }
  }, [language]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (onTextChange) {
      onTextChange(e.target.value);
    }
  };

  const handleSpeakClick = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to speak",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    const selectedVoiceObj = voices.find(voice => voice.name === selectedVoice);
    
    synthesizeSpeech(inputText, {
      voice: selectedVoiceObj || null,
      rate,
      pitch,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: (error) => {
        console.error("Speech synthesis error:", error);
        toast({
          title: "Speech Synthesis Error",
          description: "An error occurred during speech synthesis",
          variant: "destructive",
        });
        setIsSpeaking(false);
      }
    });
  };

  const handleStopClick = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleClearClick = () => {
    setInputText("");
    if (onTextChange) {
      onTextChange("");
    }
  };

  if (!isSupported) {
    return (
      <Card className={cn("border border-red-200", className)}>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-2">Text-to-speech is not supported in your browser.</p>
            <p className="text-sm text-muted-foreground">Please try using Chrome, Edge, or Safari.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Text to Speech</h2>
        <div className="flex gap-2">
          <Button
            variant={isSpeaking ? "destructive" : "default"}
            size="sm"
            className="rounded-full"
            onClick={isSpeaking ? handleStopClick : handleSpeakClick}
            disabled={!inputText.trim()}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Speak
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleClearClick}
            disabled={!inputText}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className={cn(
        "border transition-all duration-300", 
        isSpeaking ? "border-primary" : ""
      )}>
        <CardContent className="p-4">
          <Textarea
            value={inputText}
            onChange={handleTextChange}
            placeholder="Enter text to be spoken..."
            className="min-h-[100px] resize-none mb-4"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voice-select">Voice</Label>
              <Select
                value={selectedVoice}
                onValueChange={setSelectedVoice}
                disabled={voices.length === 0}
              >
                <SelectTrigger id="voice-select" className="w-full">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="rate-slider">Rate: {rate.toFixed(1)}</Label>
                </div>
                <Slider
                  id="rate-slider"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[rate]}
                  onValueChange={(value) => setRate(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="pitch-slider">Pitch: {pitch.toFixed(1)}</Label>
                </div>
                <Slider
                  id="pitch-slider"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[pitch]}
                  onValueChange={(value) => setPitch(value[0])}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextToSpeech;
