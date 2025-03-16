
import React from "react";
import { Button } from "@/components/ui/button";
import { MicIcon, VolumeIcon, HandIcon } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <HandIcon className="text-white w-5 h-5" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight">SignVoice</h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full flex gap-2 items-center">
            <MicIcon className="w-4 h-4" />
            <span>Speech</span>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full flex gap-2 items-center">
            <VolumeIcon className="w-4 h-4" />
            <span>Audio</span>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full flex gap-2 items-center">
            <HandIcon className="w-4 h-4" />
            <span>Sign</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-sm font-normal">About</Button>
          <Button variant="ghost" size="sm" className="text-sm font-normal">Contact</Button>
          <Button size="sm" className="rounded-full">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
