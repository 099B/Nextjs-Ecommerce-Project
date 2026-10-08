export type Product = {
  title_fr: string;
  title_en: string;
  title_ar: string;
  reviews: number;
  price: number;
  discountedPrice?: number;
  id: number;
  category_id?: number;
  category?: {
    id: number;
    name_fr: string;
    name_en: string;
    name_ar: string;
    slug: string;
    image_url: string;
  };
  description_fr?: string;
  description_en?: string;
  description_ar?: string;
  stock?: number;
  imgs?: string[];
  [key: string]: any; // Allow dynamic key access
};
