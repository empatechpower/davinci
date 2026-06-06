export type Artist = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  tagline: string | null;
  short_bio: string | null;
  full_bio: string | null;
  medium: string | null;
  image_url: string | null;
  cover_image_url: string | null;
  sold_count: number;
  created_at: string;
};

export type Artwork = {
  id: string;
  slug: string;
  artist_id: string | null;
  title: string;
  category: string | null;       // Product Category
  product_type: string | null;   // Product Type
  sku: string | null;
  price: number | null;
  artist_receives: number | null;
  dimensions: string | null;
  description: string | null;
  remarks: string | null;
  technique: string | null;
  story: string | null;
  inspiration: string | null;
  artist_quote: string | null;
  image_url: string | null;      // primary / legacy
  photos: string[] | null;       // multiple photos (JSON array of URLs)
  videos: string[] | null;       // multiple videos (JSON array of URLs)
  created_at: string;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  date: string | null;
  time: string | null;
  location: string | null;
  category: string | null;
  status: string;
  featured: boolean;
  expected_attendees: number | null;
  description: string | null;
  long_description: string | null;
  admission: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  total: number | null;
  status: string;
  shipping_address: string | null;
  payment_method: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  artwork_id: string | null;
  artwork_title: string | null;
  artist_name: string | null;
  quantity: number;
  price: number | null;
};

export type EventRegistration = {
  id: string;
  event_id: string;
  user_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  attendee_count: number;
  dietary_restrictions: string | null;
  special_requirements: string | null;
  registered_at: string;
};

export type User = {
  id: string;
  email: string;
  password_hash: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
};
