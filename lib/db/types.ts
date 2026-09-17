export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface DrinkOfMonth {
  id: string;
  month_key: string;
  name: string;
  description: string;
  image_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  name_fr: string | null;
  description: string | null;
  description_fr: string | null;
  price_cents: number | null;
  category: string | null;
  image_path: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  path: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}
