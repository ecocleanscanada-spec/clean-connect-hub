import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLiveGemini } from './hooks/useLiveGemini';
import { useChatGemini } from './hooks/useChatGemini';
import { Visualizer } from './components/Visualizer';
import { ChatInterface } from './components/ChatInterface';
import { BookingDetails, ECO_SERVICES } from './types';
import { Phone, X, MessageSquare, Mic } from 'lucide-react';

type Mode = 'voice' | 'text';

interface VoiceAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VoiceAgentDialog: React.FC<VoiceAgentDialogProps> = ({ open, onOpenChange }) => {
  const [mode, setMode] = useState<Mode>('voice');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({});

  const handleBookingUpdate = (details: BookingDetails) => {
    setBookingDetails(prev => ({ ...prev, ...details }));
  };

  const { connect, disconnect, connected, volume, error: voiceError } = useLiveGemini({
    onBookingUpdate: handleBookingUpdate
  });

  const { messages, sendMessage, loading: chatLoading } = useChatGemini({
    onBookingUpdate: handleBookingUpdate
  });

  useEffect(() => {
    if (mode === 'text' && connected) {
      disconnect();
    }
  }, [mode, connected, disconnect]);

  useEffect(() => {
    if (!open && connected) {
      disconnect();
    }
  }, [open, connected, disconnect]);

  const handleToggleCall = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="flex-none p-4 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">E</div>
            <div>
              <DialogTitle className="text-lg font-bold">Ecocleans Agent</DialogTitle>
              <p className="text-xs text-muted-foreground">Voice & Text Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-muted p-1 rounded-lg">
              <button 
                onClick={() => setMode('voice')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${mode === 'voice' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Mic className="w-3 h-3" />
                Voice
              </button>
              <button 
                onClick={() => setMode('text')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${mode === 'text' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <MessageSquare className="w-3 h-3" />
                Text
              </button>
            </div>

            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${connected ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`}></span>
              {connected ? 'Live' : 'Offline'}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className="flex-1 flex flex-col bg-muted/30 relative overflow-hidden">
            {mode === 'voice' && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
                <div className="w-full max-w-md bg-card/50 backdrop-blur-md rounded-xl p-4 border border-border shadow-sm max-h-[150px] overflow-y-auto">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Available Services</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ECO_SERVICES.slice(0, 6).map(service => (
                      <div key={service.id} className="text-xs p-2 bg-background rounded border border-border">
                        <span className="font-bold text-primary">{service.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Visualizer volume={volume} isActive={connected} />
                <p className="text-muted-foreground text-sm font-medium animate-pulse">
                  {connected ? "Listening..." : "Ready to connect"}
                </p>
                
                {voiceError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center">
                    {voiceError}
                  </div>
                )}

                <button
                  onClick={handleToggleCall}
                  className={`
                    flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95
                    ${connected 
                      ? 'bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20' 
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    }
                  `}
                >
                  {connected ? (
                    <>
                      <X className="w-6 h-6" />
                      <span>End Call</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-6 h-6" />
                      <span>Call Ecocleans</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {mode === 'text' && (
              <ChatInterface 
                messages={messages} 
                onSendMessage={sendMessage} 
                loading={chatLoading} 
              />
            )}
          </div>

          <div className="w-full md:w-80 bg-card border-l border-border flex flex-col max-h-[40vh] md:max-h-full overflow-y-auto">
            <div className="p-4 border-b border-border bg-muted/50">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Booking Details</h2>
            </div>
            
            <div className="flex-1 p-4 space-y-4">
              <div className="space-y-2">
                <div className="bg-background border border-border rounded p-2">
                  <label className="block text-[10px] text-muted-foreground uppercase">Name</label>
                  <div className={`text-sm ${bookingDetails.customerName ? 'text-foreground font-medium' : 'text-muted-foreground/50 italic'}`}>
                    {bookingDetails.customerName || 'Pending...'}
                  </div>
                </div>
                <div className="bg-background border border-border rounded p-2">
                  <label className="block text-[10px] text-muted-foreground uppercase">Phone</label>
                  <div className={`text-sm ${bookingDetails.phoneNumber ? 'text-foreground font-medium' : 'text-muted-foreground/50 italic'}`}>
                    {bookingDetails.phoneNumber || 'Pending...'}
                  </div>
                </div>
                <div className="bg-background border border-border rounded p-2">
                  <label className="block text-[10px] text-muted-foreground uppercase">Address</label>
                  <div className={`text-sm ${bookingDetails.address ? 'text-foreground font-medium' : 'text-muted-foreground/50 italic'}`}>
                    {bookingDetails.address || 'Pending...'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-background border border-border rounded p-2 text-center">
                  <label className="block text-[10px] text-muted-foreground uppercase">Bedrooms</label>
                  <div className={`text-lg font-bold ${bookingDetails.bedrooms ? 'text-foreground' : 'text-muted-foreground/30'}`}>
                    {bookingDetails.bedrooms || '-'}
                  </div>
                </div>
                <div className="bg-background border border-border rounded p-2 text-center">
                  <label className="block text-[10px] text-muted-foreground uppercase">Bathrooms</label>
                  <div className={`text-lg font-bold ${bookingDetails.bathrooms ? 'text-foreground' : 'text-muted-foreground/30'}`}>
                    {bookingDetails.bathrooms || '-'}
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <label className="block text-[10px] text-primary uppercase font-semibold mb-1">Schedule</label>
                <div className={`text-sm ${bookingDetails.scheduleDate ? 'text-foreground font-bold' : 'text-muted-foreground/50 italic'}`}>
                  {bookingDetails.scheduleDate || 'To be determined...'}
                </div>
                {bookingDetails.cleaningFrequency && (
                  <div className="text-xs text-primary mt-1">{bookingDetails.cleaningFrequency}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
