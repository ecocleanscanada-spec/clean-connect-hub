export enum Speaker {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  role: Speaker;
  text: string;
  timestamp: Date;
  isFinal?: boolean;
}

export interface BookingDetails {
  customerName?: string;
  phoneNumber?: string;
  address?: string;
  cleaningSize?: string;
  bedrooms?: number;
  bathrooms?: number;
  scheduleDate?: string;
  cleaningFrequency?: string;
}

export interface AudioFrequencyData {
  values: Uint8Array;
}

export const ECO_SERVICES = [
  { id: 'general', name: 'Cleaning Service', desc: 'Customizable general cleaning.' },
  { id: 'house', name: 'House Cleaning', desc: 'Full residential: bedrooms, kitchens, floors.' },
  { id: 'commercial', name: 'Commercial Cleaning', desc: 'Offices, stores, business spaces.' },
  { id: 'janitorial', name: 'Janitorial Service', desc: 'Ongoing maintenance, garbage, supplies.' },
  { id: 'maid', name: 'Maid Service', desc: 'Regular tidying & surface cleaning.' },
  { id: 'carpet', name: 'Carpet Cleaning', desc: 'Deep-clean stains and odors.' },
  { id: 'window', name: 'Window Cleaning', desc: 'Streak-free inside and out.' },
  { id: 'upholstery', name: 'Upholstery Cleaning', desc: 'Couches, chairs, mattresses.' },
  { id: 'duct', name: 'Air Duct Cleaning', desc: 'HVAC system cleaning for air quality.' },
  { id: 'pressure', name: 'Pressure Washing', desc: 'High-pressure water for outdoor areas.' },
];
