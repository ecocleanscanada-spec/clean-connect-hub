import { useState, useRef, useCallback } from 'react';
import { Modality } from '@google/genai';
import type { LiveServerMessage } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audio-utils';
import { BookingDetails } from '../types';
import { SYSTEM_INSTRUCTION, BOOKING_TOOL } from '../utils/constants';
import { supabase } from '@/integrations/supabase/client';

interface UseLiveGeminiProps {
  onBookingUpdate: (details: BookingDetails) => void;
}

export const useLiveGemini = ({ onBookingUpdate }: UseLiveGeminiProps) => {
  const [connected, setConnected] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const inputStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const disconnectRef = useRef<(() => void) | null>(null);

  const connect = async () => {
    setError(null);
    try {
      // First, get the API key from the edge function
      const { data: configData, error: configError } = await supabase.functions.invoke('gemini-live-config', {
        body: {},
      });

      if (configError || !configData?.apiKey) {
        // Fall back to a message that the live voice feature requires server configuration
        setError("Live voice feature is currently unavailable. Please use the chat interface.");
        return;
      }

      const apiKey = configData.apiKey;
      
      // Dynamic import to avoid bundling the API key
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContextClass({ 
        sampleRate: 16000,
        latencyHint: 'interactive'
      });
      outputAudioContextRef.current = new AudioContextClass({ 
        sampleRate: 24000,
        latencyHint: 'interactive'
      });
      
      if (inputAudioContextRef.current.state === 'suspended') {
        await inputAudioContextRef.current.resume();
      }
      if (outputAudioContextRef.current.state === 'suspended') {
        await outputAudioContextRef.current.resume();
      }

      outputNodeRef.current = outputAudioContextRef.current.createGain();
      outputNodeRef.current.connect(outputAudioContextRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        } 
      });
      inputStreamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: [BOOKING_TOOL] }],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: { },
          outputAudioTranscription: { },
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Session Opened');
            setConnected(true);
            
            if (!inputAudioContextRef.current || !inputStreamRef.current) return;
            
            const source = inputAudioContextRef.current.createMediaStreamSource(inputStreamRef.current);
            sourceRef.current = source;
            
            const processor = inputAudioContextRef.current.createScriptProcessor(2048, 1, 1);
            processorRef.current = processor;
            
            let lastVolumeUpdate = 0;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              const now = Date.now();
              if (now - lastVolumeUpdate > 100) {
                let sum = 0;
                for(let i=0; i<inputData.length; i+=10) sum += inputData[i] * inputData[i];
                setVolume(Math.sqrt(sum / (inputData.length/10)));
                lastVolumeUpdate = now;
              }

              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session: any) => {
                session.sendRealtimeInput({ media: pcmBlob });
              }).catch((e: any) => {
                console.error("Failed to send audio chunk:", e);
              });
            };

            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.toolCall) {
              const responses = message.toolCall.functionCalls.map(fc => {
                if (fc.name === 'update_booking_details') {
                   const args = fc.args as any;
                   onBookingUpdate(args);
                   return {
                     id: fc.id,
                     name: fc.name,
                     response: { result: "Booking details updated successfully." }
                   };
                }
                return { id: fc.id, name: fc.name, response: { result: "Unknown tool" }};
              });

              sessionPromise.then((session: any) => {
                session.sendToolResponse({ functionResponses: responses });
              }).catch((e: any) => console.error("Failed to send tool response", e));
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current && outputNodeRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                24000,
                1
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNodeRef.current);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(src => {
                try { src.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            console.log('Gemini Live Session Closed');
            setConnected(false);
          },
          onerror: (err) => {
            console.error('Gemini Live Error:', err);
            setError("Connection error detected.");
            setConnected(false);
          }
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

      disconnectRef.current = () => {
        if (sessionPromiseRef.current) {
           sessionPromiseRef.current.then((session: any) => {
             if (session && typeof session.close === 'function') {
               session.close();
             }
           }).catch(() => {});
        }
      };

    } catch (err: any) {
      setError(err.message || "Failed to connect");
      setConnected(false);
    }
  };

  const disconnect = useCallback(() => {
    if (disconnectRef.current) {
      disconnectRef.current();
      disconnectRef.current = null;
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (inputStreamRef.current) {
      inputStreamRef.current.getTracks().forEach(t => t.stop());
      inputStreamRef.current = null;
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    
    setConnected(false);
    setVolume(0);
  }, []);

  return {
    connect,
    disconnect,
    connected,
    volume,
    error
  };
};
