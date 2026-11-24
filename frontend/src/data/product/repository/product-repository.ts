import type { ProductValues } from "../../../types/product";
import type { ProductRemoteSource } from "../source/product-remote.ts";
import ProductModel from "../model/product-model.ts";
import ProductListParam from "../param/product-list-param.ts";

// Maps remote payloads into validated application models.
export default function ProductRepository({
  getProductListRemote,
  getProductRemote,
  createProductRemote,
  updateProductRemote,
  deleteProductRemote,
}: ProductRemoteSource) {
  async function getProductList(
    param = new ProductListParam(),
  ): Promise<ProductModel[]> {
    const response = await getProductListRemote(param);
    // Source sudah membuka format { status, message, data }; di sini harus berupa array.
    if (!Array.isArray(response)) {
      throw new TypeError("Response daftar produk harus berupa array.");
    }

    const products = response.map((item) => ProductModel.fromResponse(item));
    const ids = products.map((product) => product.getId());
    if (new Set(ids).size !== ids.length) {
      throw new TypeError("ID produk dari API harus unik.");
    }

    return products;
  }

  async function getProduct(id: number): Promise<ProductModel> {
    return ProductModel.fromResponse(await getProductRemote(id));
  }

  async function createProduct(values: ProductValues): Promise<ProductModel> {
    return ProductModel.fromResponse(await createProductRemote(values));
  }

  async function updateProduct(
    id: number,
    values: ProductValues,
  ): Promise<ProductModel> {
    return ProductModel.fromResponse(await updateProductRemote(id, values));
  }

  async function deleteProduct(id: number): Promise<void> {
    await deleteProductRemote(id);
  }

  return {
    getProductList,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
