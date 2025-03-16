
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export interface Language {
  code: string;
  name: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selected,
  onChange,
  className = ""
}) => {
  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger className={`w-[140px] ${className}`}>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
