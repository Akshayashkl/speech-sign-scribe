
import React from "react";
import Header from "@/components/Header";
import TranslationPanel from "@/components/TranslationPanel";
import { MicIcon, VolumeIcon, HandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-6 pb-12">
        <section className="w-full max-w-4xl mx-auto py-12 md:py-20 text-center">
          <span className="inline-block px-4 py-1 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            Speech, Text, Sign Language
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-primary">Speech</span> to 
            <span className="ml-2 relative">
              <span className="animate-scale-in">Sign</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full transform origin-left"></span>
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Translate speech to text, text to speech, and visualize in sign language with a beautifully intuitive interface.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button className="rounded-full h-12 px-6 gap-2" size="lg">
              <MicIcon className="w-5 h-5" />
              Start Speaking
            </Button>
            <Button variant="outline" className="rounded-full h-12 px-6 gap-2" size="lg">
              Learn More
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-muted-foreground">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <MicIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm">Speech to Text</span>
            </div>
            <Separator className="h-8 w-px bg-border" orientation="vertical" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <VolumeIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm">Text to Speech</span>
            </div>
            <Separator className="h-8 w-px bg-border" orientation="vertical" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <HandIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm">Sign Language</span>
            </div>
          </div>
        </section>
        
        <div className="w-full">
          <TranslationPanel />
        </div>
      </main>
      
      <footer className="py-6 px-6 border-t">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2023 SignVoice. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
