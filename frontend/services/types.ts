export type Image = {
  url: string;
  publicId?: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category?: Category;
  brand?: string;
  stock: number;
  images: Image[];
  rating?: number;
};

export type Category = {
  _id: string;
  name: string;
  description?: string;
  slug?: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type CartItem = {
  _id: string;
  product: Product | null;
  quantity: number;
};

export type OrderItem = {
  product: Product;
  quantity: number;
  price: number;
};

export type Order = {
  _id: string;
  userId: User;
  products: OrderItem[];
  totalPrice: number;
  status: string;
  address: string;
  paymentMethod: string;
};

