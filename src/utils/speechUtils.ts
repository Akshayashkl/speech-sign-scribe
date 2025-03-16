
export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (result: SpeechRecognitionResult) => void;
  onEnd?: () => void;
  onError?: (error: Error | string) => void;
}

class SpeechRecognizer {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private options: SpeechRecognitionOptions = {
    language: 'en-US',
    continuous: true,
    interimResults: true,
  };

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionAPI();
  }

  public startListening(options: SpeechRecognitionOptions = {}) {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        options.onError?.('Speech recognition not supported');
        return false;
      }
    }

    this.options = { ...this.options, ...options };
    const { language, continuous, interimResults, onResult, onEnd, onError } = this.options;

    this.recognition.lang = language || 'en-US';
    this.recognition.continuous = continuous || true;
    this.recognition.interimResults = interimResults || true;

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const result = {
        transcript: event.results[last][0].transcript,
        confidence: event.results[last][0].confidence,
      };
      
      onResult?.(result);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    this.recognition.onerror = (event) => {
      onError?.(event.error);
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      onError?.(error as Error);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      return true;
    }
    return false;
  }

  public isSupported() {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
  }

  public getStatus() {
    return this.isListening;
  }
}

export const speechRecognizer = new SpeechRecognizer();

// Text-to-Speech functionality
export interface SpeechSynthesisOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
}

export const synthesizeSpeech = (text: string, options: SpeechSynthesisOptions = {}) => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    options.onError?.(new SpeechSynthesisErrorEvent('error', { error: 'not-supported' }));
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  utterance.voice = options.voice || null;
  utterance.rate = options.rate || 1;
  utterance.pitch = options.pitch || 1;
  utterance.volume = options.volume || 1;
  
  utterance.onstart = options.onStart || (() => {});
  utterance.onend = options.onEnd || (() => {});
  utterance.onerror = options.onError || (() => {});
  
  window.speechSynthesis.speak(utterance);
  return true;
};

export const getAvailableVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    
    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
  });
};

export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window;
};
