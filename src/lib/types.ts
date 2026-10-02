export type Availability = "in_stock" | "made_to_order" | "out_of_stock";

export type BusinessHour = {
  day: string; // "Monday" … "Sunday"
  open: string | null; // "10:00"
  close: string | null; // "20:00"
  closed: boolean;
};

export type SiteSettings = {
  business_name: string;
  tagline: string | null;
  whatsapp_number: string | null;
  phone: string | null;
  email: string | null;
  address_line: string | null;
  locality: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  maps_url: string;
  maps_embed_url: string | null;
  latitude: number | null;
  longitude: number | null;
  instagram_url: string;
  facebook_url: string | null;
  youtube_url: string | null;
  business_hours: BusinessHour[];
  hours_note: string | null;
  service_areas: string[];
  about_text: string | null;
  hero_image_url: string | null;
  hero_video_url: string | null;
  default_whatsapp_message: string | null;
  instagram_mode: "api" | "manual" | "off";
  instagram_post_limit: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  intro: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  subcategory: string | null;
  short_description: string | null;
  description: string | null;
  images: string[];
  image_alt: string | null;
  sizes: string[];
  colors: string[];
  fabric: string | null;
  price: number | null;
  is_customizable: boolean;
  customization_notes: string | null;
  stitching_available: boolean;
  availability: Availability;
  is_featured: boolean;
  featured_order: number;
  is_visible: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  updated_at: string;
  category?: Pick<Category, "id" | "name" | "slug"> | null;
};

export type DailyLocation = {
  id: string;
  date: string; // YYYY-MM-DD (IST)
  location_name: string;
  address: string | null;
  maps_url: string | null;
  open_time: string | null; // HH:MM[:SS]
  close_time: string | null;
  is_open: boolean;
  announcement: string | null;
};

export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  context: string | null;
  is_visible: boolean;
  sort_order: number;
};

export type InstagramPost = {
  id: string;
  permalink: string;
  image_url: string;
  caption: string | null;
  is_video: boolean;
};

export type StaffRole = "admin" | "editor";
