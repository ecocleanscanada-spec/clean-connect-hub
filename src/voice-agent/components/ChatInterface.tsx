import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Speaker } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  loading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
           <div className="text-center mt-20 text-muted-foreground">
              <p className="text-sm">Start chatting with Ecocleans.</p>
              <p className="text-xs mt-2">Ask about our services or book a cleaning.</p>
           </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === Speaker.USER ? 'justify-end' : 'justify-start'}`}>
            <div className={`
               max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm
               ${msg.role === Speaker.USER 
                 ? 'bg-primary text-primary-foreground rounded-br-none' 
                 : msg.role === Speaker.SYSTEM
                   ? 'bg-destructive/10 text-destructive border border-destructive/20'
                   : 'bg-muted text-foreground border border-border rounded-bl-none'
               }
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="bg-muted text-muted-foreground border border-border px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s'}}></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></span>
             </div>
           </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 bg-card border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-muted text-foreground placeholder-muted-foreground border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
