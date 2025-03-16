
import React, { useState, useEffect } from "react";
import SpeechRecognition from "./SpeechRecognition";
import TextToSpeech from "./TextToSpeech";
import SignLanguage from "./SignLanguage";
import LanguageSelector, { Language } from "./LanguageSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MicIcon, VolumeIcon, HandIcon } from "lucide-react";

// List of supported languages
const LANGUAGES: Language[] = [
  { code: "en-US", name: "English (US)" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "it-IT", name: "Italian" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "zh-CN", name: "Chinese" },
];

const TranslationPanel: React.FC = () => {
  const [inputLanguage, setInputLanguage] = useState<string>("en-US");
  const [outputLanguage, setOutputLanguage] = useState<string>("en-US");
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("speech");

  // Simple "translation" (in a real app, this would use a translation API)
  useEffect(() => {
    if (inputText) {
      // In a real app, this would call a translation API
      if (inputLanguage === outputLanguage) {
        setOutputText(inputText);
      } else {
        // Mock translation by adding a prefix
        setOutputText(`[${outputLanguage}] ${inputText}`);
      }
    } else {
      setOutputText("");
    }
  }, [inputText, inputLanguage, outputLanguage]);

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="glass-panel">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Input</h3>
              <LanguageSelector
                languages={LANGUAGES}
                selected={inputLanguage}
                onChange={setInputLanguage}
              />
            </div>
            
            <Tabs defaultValue="speech" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="speech" className="flex items-center gap-2">
                  <MicIcon className="w-4 h-4" />
                  Speech
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <VolumeIcon className="w-4 h-4" />
                  Text
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="speech" className="mt-0">
                <SpeechRecognition
                  language={inputLanguage}
                  onTranscriptChange={setInputText}
                />
              </TabsContent>
              
              <TabsContent value="text" className="mt-0">
                <TextToSpeech
                  text={inputText}
                  language={inputLanguage}
                  onTextChange={setInputText}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="glass-panel">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Output</h3>
              <LanguageSelector
                languages={LANGUAGES}
                selected={outputLanguage}
                onChange={setOutputLanguage}
              />
            </div>
            
            <Tabs defaultValue="text">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <VolumeIcon className="w-4 h-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="speech" className="flex items-center gap-2">
                  <MicIcon className="w-4 h-4" />
                  Speech
                </TabsTrigger>
                <TabsTrigger value="sign" className="flex items-center gap-2">
                  <HandIcon className="w-4 h-4" />
                  Sign
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="mt-0">
                <TextToSpeech
                  text={outputText}
                  language={outputLanguage}
                />
              </TabsContent>
              
              <TabsContent value="speech" className="mt-0">
                <TextToSpeech
                  text={outputText}
                  language={outputLanguage}
                />
              </TabsContent>
              
              <TabsContent value="sign" className="mt-0">
                <SignLanguage text={outputText} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranslationPanel;
