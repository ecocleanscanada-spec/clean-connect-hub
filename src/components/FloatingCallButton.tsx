import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { VoiceAgentDialog } from '@/voice-agent/VoiceAgentDialog';

export const FloatingCallButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
        aria-label="Call Ecocleans"
      >
        <Phone className="w-7 h-7 group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
      </button>
      
      <VoiceAgentDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default FloatingCallButton;
