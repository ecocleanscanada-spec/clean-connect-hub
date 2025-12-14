import { useState, useRef } from 'react';
import { GoogleGenAI, FunctionCallingConfigMode } from '@google/genai';
import { BookingDetails, ChatMessage, Speaker } from '../types';
import { SYSTEM_INSTRUCTION } from '../utils/constants';

const API_KEY = 'AIzaSyCbaCuijjUSShfTjqiS04BrJXW7Q00abEI';

interface UseChatGeminiProps {
  onBookingUpdate: (details: BookingDetails) => void;
}

export const useChatGemini = ({ onBookingUpdate }: UseChatGeminiProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const aiRef = useRef<GoogleGenAI | null>(null);

  const getAI = () => {
    if (!aiRef.current) {
      if (!API_KEY) throw new Error("API Key not found");
      aiRef.current = new GoogleGenAI({ apiKey: API_KEY });
    }
    return aiRef.current;
  };

  const sendMessage = async (text: string) => {
    setLoading(true);
    
    const userMsgId = Date.now().toString();
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: Speaker.USER, text, timestamp: new Date() }
    ]);

    try {
      const ai = getAI();
      
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role === Speaker.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...conversationHistory,
          { role: 'user', parts: [{ text }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      const modelResponseText = response.text;
      
      if (modelResponseText) {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), role: Speaker.MODEL, text: modelResponseText, timestamp: new Date() }
        ]);

        // Try to extract booking details from the response
        extractBookingDetails(text + ' ' + modelResponseText, onBookingUpdate);
      }
    } catch (err: any) {
      console.error("Chat Error:", err);
      setError("Failed to send message.");
      setMessages(prev => [
        ...prev, 
        { id: Date.now().toString(), role: Speaker.SYSTEM, text: "Error: Could not reach Ecocleans agent.", timestamp: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    error
  };
};

// Simple extraction helper
function extractBookingDetails(text: string, onBookingUpdate: (details: BookingDetails) => void) {
  const details: BookingDetails = {};
  
  // Extract phone number
  const phoneMatch = text.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
  if (phoneMatch) details.phoneNumber = phoneMatch[1];
  
  // Extract email
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (emailMatch) details.email = emailMatch[1];
  
  // Extract bedrooms
  const bedroomMatch = text.match(/(\d+)\s*(?:bed(?:room)?s?)/i);
  if (bedroomMatch) details.bedrooms = parseInt(bedroomMatch[1]);
  
  // Extract bathrooms
  const bathroomMatch = text.match(/(\d+)\s*(?:bath(?:room)?s?)/i);
  if (bathroomMatch) details.bathrooms = parseInt(bathroomMatch[1]);
  
  if (Object.keys(details).length > 0) {
    onBookingUpdate(details);
  }
}
