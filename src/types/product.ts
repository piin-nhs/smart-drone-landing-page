export interface Product {
  _id?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: "drone" | "accessory";
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  rating: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
