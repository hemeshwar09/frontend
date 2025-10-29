import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'customer' | 'salon_owner';
  created_at: string;
  updated_at: string;
};

export type Salon = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  cover_image: string | null;
  images: string[];
  working_hours: Record<string, any>;
  price_range: 'budget' | 'moderate' | 'premium' | 'luxury';
  rating: number;
  total_reviews: number;
  featured: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  salon_id: string;
  name: string;
  description: string | null;
  category: 'haircut' | 'coloring' | 'styling' | 'spa' | 'facial' | 'makeup' | 'bridal' | 'massage' | 'nails' | 'waxing';
  price: number;
  duration_minutes: number;
  image_url: string | null;
  available: boolean;
  created_at: string;
  updated_at: string;
};

export type Stylist = {
  id: string;
  salon_id: string;
  name: string;
  bio: string | null;
  photo_url: string | null;
  specialties: string[];
  rating: number;
  available: boolean;
  created_at: string;
};

export type Booking = {
  id: string;
  customer_id: string;
  salon_id: string;
  service_id: string;
  stylist_id: string | null;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  notes: string | null;
  total_price: number;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  salon_id: string;
  customer_id: string;
  booking_id: string | null;
  rating: number;
  comment: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  salon_id: string;
  created_at: string;
};
