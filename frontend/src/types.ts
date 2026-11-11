export interface Product {
  id: number;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  price: number;
}

// Bentuk respons dari backend: { status, message, data }
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
}