import { useEffect, useMemo, useState } from "react"
import { TbPlus } from "react-icons/tb"
import { productRepository } from "../../../data/product"
import type { Product, ProductValues } from "../../../types/product"
import { getErrorMessage } from "../../../utils/getErrorMessage"
import Alert from "../../atoms/Alert"
import Button from "../../atoms/Button"
import SearchBar from "../../molecules/SearchBar"
import DeleteProductModal from "../../organisms/DeleteProductModal"
import ProductFormModal from "../../organisms/ProductFormModal"
import ProductGrid from "../../organisms/ProductGrid"
import styles from "./styles.module.css"

type ModalState =
    | { type: "add" }
    | { type: "edit"; product: Product }
    | { type: "delete"; product: Product }
    | null

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState("")
    const [attempt, setAttempt] = useState(0)
    const [search, setSearch] = useState("")
    const [notice, setNotice] = useState("")
    const [modal, setModal] = useState<ModalState>(null)

    // Ambil data dari backend saat halaman dibuka (dan saat tombol "Coba lagi" ditekan)
    useEffect(() => {
        let ignore = false
        productRepository
            .getProductList()
            .then((models) => {
                if (!ignore) setProducts(models.map((model) => model.toJSON()))
            })
            .catch((error: unknown) => {
                if (!ignore) setLoadError(getErrorMessage(error, "Gagal memuat produk."))
            })
            .finally(() => {
                if (!ignore) setIsLoading(false)
            })
        return () => {
            ignore = true
        }
    }, [attempt])

    // Pencarian berdasarkan nama (huruf besar/kecil tidak berpengaruh)
    const keyword = search.trim().toLowerCase()
    const filteredProducts = useMemo(
        () => products.filter((product) => product.name.toLowerCase().includes(keyword)),
        [products, keyword],
    )

    function handleRetry() {
        setLoadError("")
        setIsLoading(true)
        setAttempt((value) => value + 1)
    }

    function openModal(next: ModalState) {
        setNotice("")
        setModal(next)
    }

    function closeModal() {
        setModal(null)
    }

    // Error dari backend dilempar ke pop-up, supaya pesannya tampil di dalam form
    async function handleCreate(values: ProductValues) {
        const created = await productRepository.createProduct(values)
        setProducts((current) => [...current, created.toJSON()])
        setNotice(`Produk "${created.getName()}" berhasil ditambahkan.`)
        closeModal()
    }

    async function handleUpdate(id: number, values: ProductValues) {
        const updated = await productRepository.updateProduct(id, values)
        setProducts((current) =>
            current.map((product) => (product.id === id ? updated.toJSON() : product)),
        )
        setNotice(`Produk "${updated.getName()}" berhasil diperbarui.`)
        closeModal()
    }

    async function handleDelete(target: Product) {
        await productRepository.deleteProduct(target.id)
        setProducts((current) => current.filter((product) => product.id !== target.id))
        setNotice(`Produk "${target.name}" berhasil dihapus.`)
        closeModal()
    }

    return (
        <>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Manajemen Produk</h1>
                    <p className={styles.description}>
                        Kelola daftar produk dan harga dalam satu tempat.
                    </p>
                </div>
                <Button onClick={() => openModal({ type: "add" })}>
                    <TbPlus aria-hidden="true" />
                    Tambah Produk
                </Button>
            </header>

            <div className={styles.toolbar}>
                <SearchBar value={search} onChange={setSearch} />
                <p className={styles.count}>{products.length} produk</p>
            </div>

            {notice && (
                <div className={styles.feedback}>
                    <Alert variant="success">{notice}</Alert>
                </div>
            )}

            {isLoading && (
                <p role="status" className={styles.notice}>
                    Memuat produk...
                </p>
            )}

            {loadError && (
                <div className={styles.feedback}>
                    <Alert variant="error">{loadError}</Alert>
                    <div className={styles.retry}>
                        <Button variant="secondary" onClick={handleRetry}>
                            Coba lagi
                        </Button>
                    </div>
                </div>
            )}

            {!isLoading && !loadError && (
                <>
                    {filteredProducts.length === 0 ? (
                        <p className={styles.notice}>
                            {products.length === 0
                                ? "Belum ada produk."
                                : "Produk tidak ditemukan."}
                        </p>
                    ) : (
                        <ProductGrid
                            products={filteredProducts}
                            onEdit={(product) => openModal({ type: "edit", product })}
                            onDelete={(product) => openModal({ type: "delete", product })}
                        />
                    )}
                    <p className={styles.footer}>
                        Menampilkan {filteredProducts.length} dari {products.length} produk
                    </p>
                </>
            )}

            {modal?.type === "add" && (
                <ProductFormModal
                    product={null}
                    onClose={closeModal}
                    onSubmit={handleCreate}
                />
            )}
            {modal?.type === "edit" && (
                <ProductFormModal
                    product={modal.product}
                    onClose={closeModal}
                    onSubmit={(values) => handleUpdate(modal.product.id, values)}
                />
            )}
            {modal?.type === "delete" && (
                <DeleteProductModal
                    product={modal.product}
                    onClose={closeModal}
                    onConfirm={() => handleDelete(modal.product)}
                />
            )}
        </>
    )
}