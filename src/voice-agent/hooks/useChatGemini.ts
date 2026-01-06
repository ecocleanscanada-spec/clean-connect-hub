import { useState, useRef } from 'react';
import { BookingDetails, ChatMessage, Speaker } from '../types';
import { SYSTEM_INSTRUCTION } from '../utils/constants';
import { supabase } from '@/integrations/supabase/client';

interface UseChatGeminiProps {
  onBookingUpdate: (details: BookingDetails) => void;
}

interface ChatHistoryMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export const useChatGemini = ({ onBookingUpdate }: UseChatGeminiProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const accumulatedDetails = useRef<BookingDetails>({});

  const saveBookingToDatabase = async (details: BookingDetails) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-booking', {
        body: {
          id: currentBookingId || undefined,
          customerName: details.customerName || undefined,
          phoneNumber: details.phoneNumber || undefined,
          email: details.email || undefined,
          address: details.address || undefined,
          cleaningSize: details.cleaningSize || undefined,
          bedrooms: details.bedrooms || undefined,
          bathrooms: details.bathrooms || undefined,
          cleaningFrequency: details.cleaningFrequency || undefined,
          scheduleDate: details.scheduleDate || undefined,
          notes: details.notes || undefined,
        },
      });

      if (error) {
        console.error('Error saving booking:', error);
        return;
      }

      if (data?.id && !currentBookingId) {
        setCurrentBookingId(data.id);
      }
    } catch (err) {
      console.error('Error saving booking:', err);
    }
  };

  const sendMessage = async (text: string) => {
    setLoading(true);
    
    const userMsgId = Date.now().toString();
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: Speaker.USER, text, timestamp: new Date() }
    ]);

    try {
      // Build conversation history for context
      const conversationHistory: ChatHistoryMessage[] = messages.map(msg => ({
        role: msg.role === Speaker.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Call the secure edge function instead of direct API
      const { data, error: invokeError } = await supabase.functions.invoke('gemini-chat', {
        body: {
          messages: conversationHistory,
          userMessage: text,
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Failed to get response');
      }

      const modelResponseText = data?.response;
      
      if (modelResponseText) {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), role: Speaker.MODEL, text: modelResponseText, timestamp: new Date() }
        ]);

        // Try to extract booking details from the response
        const newDetails = extractBookingDetails(text + ' ' + modelResponseText);
        if (Object.keys(newDetails).length > 0) {
          // Accumulate details
          accumulatedDetails.current = { ...accumulatedDetails.current, ...newDetails };
          onBookingUpdate(accumulatedDetails.current);
          
          // Save to database via edge function
          await saveBookingToDatabase(accumulatedDetails.current);
        }
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

  const resetConversation = () => {
    setMessages([]);
    setCurrentBookingId(null);
    accumulatedDetails.current = {};
  };

  return {
    messages,
    sendMessage,
    loading,
    error,
    resetConversation
  };
};

// Simple extraction helper
function extractBookingDetails(text: string): BookingDetails {
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

  // Extract name patterns like "my name is X" or "I'm X" or "this is X"
  const nameMatch = text.match(/(?:my name is|i'm|i am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch) details.customerName = nameMatch[1];

  // Extract address patterns
  const addressMatch = text.match(/(?:address is|live at|located at|at)\s+(\d+[^,.\n]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|boulevard|blvd)[^,.\n]*)/i);
  if (addressMatch) details.address = addressMatch[1];

  // Extract cleaning frequency
  const frequencyMatch = text.match(/\b(one[- ]?time|weekly|bi[- ]?weekly|monthly|every\s+(?:week|two weeks|month))\b/i);
  if (frequencyMatch) details.cleaningFrequency = frequencyMatch[1];
  
  return details;
}
