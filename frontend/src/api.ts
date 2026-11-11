import type { ApiResponse, Product, ProductInput } from "./types";

const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Satu fungsi untuk semua request. Kalau gagal, lempar Error berisi pesan dari backend
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.");
  }

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !body || !body.status) {
    throw new Error(body?.message ?? "Terjadi kesalahan pada server.");
  }

  return body.data as T;
}

export const getProducts = () => request<Product[]>("/products");

export const createProduct = (input: ProductInput) =>
  request<Product>("/products", { method: "POST", body: JSON.stringify(input) });

export const updateProduct = (id: number, input: ProductInput) =>
  request<Product>("/products", { method: "PUT", body: JSON.stringify({ id, ...input }) });

export const deleteProduct = (id: number) =>
  request<Product>(`/products/${id}`, { method: "DELETE" });