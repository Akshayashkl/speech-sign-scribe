
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandIcon, PlayIcon, PauseIcon, SkipForwardIcon } from "lucide-react";
import { getSignGesturesForWord, SignGesture } from "@/utils/signLanguageUtils";
import { cn } from "@/lib/utils";

interface SignLanguageProps {
  text: string;
  className?: string;
}

const Hand: React.FC<{
  gesture: SignGesture | null;
  isAnimating: boolean;
}> = ({ gesture, isAnimating }) => {
  if (!gesture || !gesture.handPositions || gesture.handPositions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground text-sm">No sign gesture available</p>
      </div>
    );
  }

  const handPosition = gesture.handPositions[0];
  const { palm, fingers } = handPosition;

  return (
    <div className="hand-container h-[200px] relative">
      {/* Palm with 3D effect using gradients and shadows */}
      <div 
        className={cn(
          "palm absolute rounded-[40%] shadow-lg",
          isAnimating ? "animate-hand-wave" : "",
          "bg-gradient-to-br from-[#403E43] to-[#221F26]"
        )}
        style={{
          left: `${palm.x}%`,
          top: `${palm.y}%`,
          width: `${palm.width}%`,
          height: `${palm.height}%`,
          transform: `rotate3d(${handPosition.rotation.x}, ${handPosition.rotation.y}, ${handPosition.rotation.z}, ${Math.sqrt(
            Math.pow(handPosition.rotation.x, 2) +
            Math.pow(handPosition.rotation.y, 2) +
            Math.pow(handPosition.rotation.z, 2)
          )}deg)`,
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.6), inset 2px 2px 4px rgba(255, 255, 255, 0.1), inset -2px -2px 4px rgba(0, 0, 0, 0.4)"
        }}
      />
      
      {/* Fingers with 3D effect */}
      {fingers.map((finger, index) => {
        const fingerClass = finger.isBent ? "rounded-t-full" : "rounded-full";
        return (
          <div
            key={`finger-${index}`}
            className={cn(
              "finger absolute",
              fingerClass,
              isAnimating ? "animate-finger-move" : "",
              "bg-gradient-to-br from-[#333333] to-[#222222]"
            )}
            style={{
              left: `${finger.x}%`,
              top: `${finger.y}%`,
              width: `${finger.width}%`,
              height: `${finger.length}%`,
              transform: `rotate(${finger.rotation}deg)`,
              transformOrigin: "bottom center",
              animationDelay: `${index * 0.1}s`,
              boxShadow: "1px 2px 4px rgba(0, 0, 0, 0.6), inset 1px 1px 2px rgba(255, 255, 255, 0.1), inset -1px -1px 2px rgba(0, 0, 0, 0.4)"
            }}
          />
        );
      })}
    </div>
  );
};

const SignLanguage: React.FC<SignLanguageProps> = ({
  text,
  className = "",
}) => {
  const [wordToSign, setWordToSign] = useState("");
  const [currentGestureIndex, setCurrentGestureIndex] = useState(0);
  const [gestures, setGestures] = useState<SignGesture[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLetter, setCurrentLetter] = useState("");
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (text.trim()) {
      // Take the first word for simplicity
      const firstWord = text.trim().split(/\s+/)[0];
      setWordToSign(firstWord);
      
      // Generate gestures for the word
      const wordGestures = getSignGesturesForWord(firstWord);
      setGestures(wordGestures);
      
      if (wordGestures.length > 0) {
        setCurrentGestureIndex(0);
        setCurrentLetter(firstWord[0]);
      }
    } else {
      setWordToSign("");
      setGestures([]);
      setCurrentLetter("");
    }

    // Cleanup animation on text change
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    }
  }, [text]);

  const animateGestures = () => {
    if (!gestures.length) return;

    let startTime: number | null = null;
    let currentIndex = currentGestureIndex;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const currentGesture = gestures[currentIndex];
      if (elapsed > currentGesture.duration) {
        // Move to next gesture
        currentIndex = (currentIndex + 1) % gestures.length;
        setCurrentGestureIndex(currentIndex);
        setCurrentLetter(wordToSign[currentIndex] || "");
        startTime = timestamp;
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      animateGestures();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleNext = () => {
    if (!gestures.length) return;
    
    const nextIndex = (currentGestureIndex + 1) % gestures.length;
    setCurrentGestureIndex(nextIndex);
    setCurrentLetter(wordToSign[nextIndex] || "");
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Sign Language</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={isPlaying ? "outline" : "default"}
            size="sm"
            className="rounded-full"
            onClick={handlePlayPause}
            disabled={!gestures.length}
          >
            {isPlaying ? (
              <>
                <PauseIcon className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleNext}
            disabled={!gestures.length}
          >
            <SkipForwardIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="border overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div className="bg-[#1A1F2C] p-2 flex items-center justify-between">
            <div className="flex items-center">
              <HandIcon className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">
                {wordToSign ? `Signing: "${wordToSign}"` : "Enter text to see sign language"}
              </span>
            </div>
            {currentLetter && (
              <div className="bg-primary/10 px-2 py-1 rounded text-sm backdrop-blur-sm">
                Letter: {currentLetter.toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center p-4 bg-gradient-to-br from-[#222222] to-[#000000e6] h-[250px] relative">
            {/* Add a subtle glow effect in the background */}
            <div className="absolute inset-0 bg-gradient-radial from-[#3336] to-transparent opacity-20" />
            
            {gestures.length > 0 ? (
              <Hand 
                gesture={gestures[currentGestureIndex]} 
                isAnimating={isPlaying}
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <HandIcon className="w-12 h-12 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground text-sm">
                  {text ? "Processing sign language..." : "Enter text to see sign language"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="text-xs text-muted-foreground text-center">
        Note: Currently supporting basic letter signs (A-Z) for demonstration
      </div>
    </div>
  );
};

export default SignLanguage;
