import { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { BookingDetails, ChatMessage, Speaker } from '../types';
import { SYSTEM_INSTRUCTION } from '../utils/constants';
import { supabase } from '@/integrations/supabase/client';

const API_KEY = 'AIzaSyCbaCuijjUSShfTjqiS04BrJXW7Q00abEI';

interface UseChatGeminiProps {
  onBookingUpdate: (details: BookingDetails) => void;
}

export const useChatGemini = ({ onBookingUpdate }: UseChatGeminiProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const accumulatedDetails = useRef<BookingDetails>({});
  
  const aiRef = useRef<GoogleGenAI | null>(null);

  const getAI = () => {
    if (!aiRef.current) {
      if (!API_KEY) throw new Error("API Key not found");
      aiRef.current = new GoogleGenAI({ apiKey: API_KEY });
    }
    return aiRef.current;
  };

  const saveBookingToDatabase = async (details: BookingDetails) => {
    try {
      const bookingData = {
        customer_name: details.customerName || null,
        phone_number: details.phoneNumber || null,
        email: details.email || null,
        address: details.address || null,
        cleaning_size: details.cleaningSize || null,
        bedrooms: details.bedrooms || null,
        bathrooms: details.bathrooms || null,
        cleaning_frequency: details.cleaningFrequency || null,
        schedule_date: details.scheduleDate || null,
        notes: details.notes || null,
      };

      if (currentBookingId) {
        // Update existing booking
        const { error } = await supabase
          .from('bookings')
          .update(bookingData)
          .eq('id', currentBookingId);
        
        if (error) {
          console.error('Error updating booking:', error);
        }
      } else {
        // Create new booking
        const { data, error } = await supabase
          .from('bookings')
          .insert(bookingData)
          .select('id')
          .single();
        
        if (error) {
          console.error('Error creating booking:', error);
        } else if (data) {
          setCurrentBookingId(data.id);
        }
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
        const newDetails = extractBookingDetails(text + ' ' + modelResponseText);
        if (Object.keys(newDetails).length > 0) {
          // Accumulate details
          accumulatedDetails.current = { ...accumulatedDetails.current, ...newDetails };
          onBookingUpdate(accumulatedDetails.current);
          
          // Save to database
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
