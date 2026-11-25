import type { ProductValues } from "../../../types/product";
import ApiError from "../../api-error.ts";
import ProductListParam from "../param/product-list-param.ts";

export type ProductRemoteSource = {
  getProductListRemote: (param?: ProductListParam) => Promise<unknown>;
  getProductRemote: (id: number) => Promise<unknown>;
  createProductRemote: (values: ProductValues) => Promise<unknown>;
  updateProductRemote: (id: number, values: ProductValues) => Promise<unknown>;
  deleteProductRemote: (id: number) => Promise<unknown>;
};

type ProductRemoteOptions = {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
};

// Backend membalas { status, message, data }. Gagal: { status: false, message }.
function readMessage(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const { message } = body as { message?: unknown };
  return typeof message === "string" && message.trim() ? message : undefined;
}

function isSuccessEnvelope(
  body: unknown,
): body is { status: true; data?: unknown } {
  return (
    typeof body === "object" &&
    body !== null &&
    (body as { status?: unknown }).status === true
  );
}

// Sends HTTP requests and returns the unvalidated `data` payload from the backend.
export default function ProductRemote({
  baseUrl = "",
  fetchImpl = fetch,
}: ProductRemoteOptions = {}): ProductRemoteSource {
  async function request(
    path: string,
    init: RequestInit,
    search = "",
  ): Promise<unknown> {
    if (!baseUrl.trim()) {
      throw new Error("Isi VITE_API_BASE_URL di .env.local terlebih dahulu.");
    }

    const url = new URL(`${baseUrl.replace(/\/+$/, "")}${path}`);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("URL API harus menggunakan http atau https.");
    }
    url.search = search;

    const headers: Record<string, string> = { Accept: "application/json" };
    if (init.body) headers["Content-Type"] = "application/json";

    let response: Response;
    try {
      response = await fetchImpl(url, { ...init, headers });
    } catch {
      throw new ApiError(
        0,
        "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.",
      );
    }

    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        readMessage(body) ?? `Permintaan gagal (HTTP ${response.status}).`,
      );
    }
    if (!isSuccessEnvelope(body)) {
      throw new ApiError(response.status, "Format response API tidak valid.");
    }
    return body.data;
  }

  return {
    getProductListRemote: (param = new ProductListParam()) =>
      request("/products", { method: "GET" }, param.toQueryString()),
    getProductRemote: (id) => request(`/products/${id}`, { method: "GET" }),
    createProductRemote: (values) =>
      request("/products", {
        method: "POST",
        body: JSON.stringify(values),
      }),
    // Backend menerima id di dalam body: PUT /products { id, name, price }
    updateProductRemote: (id, values) =>
      request("/products", {
        method: "PUT",
        body: JSON.stringify({ id, ...values }),
      }),
    deleteProductRemote: (id) =>
      request(`/products/${id}`, { method: "DELETE" }),
  };
}
