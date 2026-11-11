import { useState } from "react";
import type { Product } from "../types";
import { formatRupiah } from "../utils";
import Modal from "./modal";

interface Props {
  product: Product;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteModal({ product, onClose, onConfirm }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="trash-icon" aria-hidden="true">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </div>

      <h2 className="modal-title center">Hapus Produk?</h2>
      <p className="modal-subtitle center">Produk yang dihapus tidak dapat dikembalikan.</p>

      <div className="delete-info">
        <span className="card-id">ID: {product.id}</span>
        <strong className="delete-name">{product.name}</strong>
        <span className="card-price">{formatRupiah(product.price)}</span>
      </div>

      {error && <p className="alert">{error}</p>}

      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
          Batal
        </button>
        <button type="button" className="btn btn-danger" onClick={handleConfirm} disabled={submitting}>
          {submitting ? "Menghapus..." : "Hapus Produk"}
        </button>
      </div>
    </Modal>
  );
}