import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./api";
import DeleteModal from "./components/deleteModal";
import ProductCard from "./components/productCard";
import ProductFormModal from "./components/productFormModal";
import type { Product, ProductInput } from "./types";

type ModalState =
  | { type: "add" }
  | { type: "edit"; product: Product }
  | { type: "delete"; product: Product }
  | null;

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  // Ambil data produk saat halaman pertama kali dibuka
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((error) =>
        setLoadError(error instanceof Error ? error.message : "Gagal memuat data produk."),
      )
      .finally(() => setLoading(false));
  }, []);

  // Pencarian berdasarkan nama (huruf besar/kecil tidak berpengaruh)
  const keyword = search.trim().toLowerCase();
  const filtered = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(keyword)),
    [products, keyword],
  );

  const closeModal = () => setModal(null);

  const handleCreate = async (input: ProductInput) => {
    const created = await createProduct(input);
    setProducts((prev) => [...prev, created]);
    closeModal();
  };

  const handleUpdate = async (id: number, input: ProductInput) => {
    const updated = await updateProduct(id, input);
    setProducts((prev) => prev.map((product) => (product.id === id ? updated : product)));
    closeModal();
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
    closeModal();
  };

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1 className="title">Manajemen Produk</h1>
          <p className="subtitle">Kelola daftar produk dan harga dalam satu tempat.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setModal({ type: "add" })}>
          + Tambah Produk
        </button>
      </header>

      <div className="toolbar">
        <div className="search">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama produk..."
          />
        </div>
        <span className="count">{products.length} produk</span>
      </div>

      {loading && <p className="state">Memuat produk...</p>}

      {loadError && (
        <div className="state state-error">
          <p>{loadError}</p>
          <button type="button" className="btn btn-outline" onClick={() => window.location.reload()}>
            Coba lagi
          </button>
        </div>
      )}

      {!loading && !loadError && (
        <>
          {filtered.length === 0 ? (
            <p className="state">
              {products.length === 0 ? "Belum ada produk." : "Produk tidak ditemukan."}
            </p>
          ) : (
            <section className="grid">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={(item) => setModal({ type: "edit", product: item })}
                  onDelete={(item) => setModal({ type: "delete", product: item })}
                />
              ))}
            </section>
          )}
          <p className="footer-note">
            Menampilkan {filtered.length} dari {products.length} produk
          </p>
        </>
      )}

      {modal?.type === "add" && (
        <ProductFormModal product={null} onClose={closeModal} onSubmit={handleCreate} />
      )}
      {modal?.type === "edit" && (
        <ProductFormModal
          product={modal.product}
          onClose={closeModal}
          onSubmit={(input) => handleUpdate(modal.product.id, input)}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteModal
          product={modal.product}
          onClose={closeModal}
          onConfirm={() => handleDelete(modal.product.id)}
        />
      )}
    </main>
  );
}