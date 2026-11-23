import { useState } from "react"
import Button from "../../atoms/Button"
import ProductModel from "../../../data/product/model/product-model.ts"
import ProductRemote from "../../../data/product/source/product-remote.ts"
import ProductRepository from "../../../data/product/repository/product-repository.ts"
import ProductGrid from "../../organisms/ProductGrid"
import styles from "./styles.module.css"

const exampleProducts = [
    ProductModel.fromResponse({ id: 1, name: "Pulpen", price: 5000 }).toJSON(),
]
const repository = ProductRepository(
    ProductRemote({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "" }),
)

export default function ProductsPage() {
    const [products, setProducts] = useState(exampleProducts)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [selectedProductId, setSelectedProductId] = useState<number | null>(
        null,
    )
    const selectedProduct = products.find(
        (product) => product.id === selectedProductId,
    )

    async function handleLoadProducts() {
        setIsLoading(true)
        setError("")
        setMessage("Memuat produk…")
        try {
            const models = await repository.getProductList()
            setProducts(models.map((model) => model.toJSON()))
            setSelectedProductId(null)
            setMessage(`${models.length} produk berhasil dimuat dari API.`)
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Gagal memuat produk.",
            )
            setMessage("")
        } finally {
            setIsLoading(false)
        }
    }

    function handleSelectProduct(id: number) {
        setSelectedProductId(id)
        setMessage("")
    }

    return (
        <>
            <header className={styles.header}>
                <p className={styles.eyebrow}>Starter pembelajaran React</p>
                <h1 className={styles.title}>Manajemen Produk</h1>
                <p className={styles.description}>
                    Satu contoh komponen untuk setiap tingkat Atomic Design.
                    Kembangkan fitur berikutnya sesuai PRD.
                </p>
            </header>
            <div className={styles.toolbar}>
                <Button onClick={handleLoadProducts} disabled={isLoading}>
                    {isLoading ? "Memuat…" : "Muat dari API"}
                </Button>
                <p className={styles.hint}>
                    Opsional: gunakan backend Anda sendiri. Saat halaman dibuka,
                    tidak ada request API.
                </p>
            </div>
            {error && (
                <p role="alert" className={styles.error}>
                    {error}
                </p>
            )}
            <section aria-label="Contoh daftar produk" aria-busy={isLoading}>
                {products.length === 0 && (
                    <p className={styles.notice}>Belum ada produk dari API.</p>
                )}
                <ProductGrid
                    products={products}
                    onSelect={handleSelectProduct}
                />
            </section>
            <p role="status" className={styles.notice}>
                {message ||
                    (selectedProduct
                        ? `Produk dipilih: ${selectedProduct.name}.`
                        : "Klik Pilih produk untuk mempelajari callback dari kartu ke halaman.")}
            </p>
        </>
    )
}
