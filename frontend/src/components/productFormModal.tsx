import { useState } from "react";
import type { FormEvent } from "react";
import type { Product, ProductInput } from "../types";
import Modal from "./modal";

interface Props {
  product: Product | null;
  onClose: () => void;
  onSubmit: (input: ProductInput) => Promise<void>;
}

export default function ProductFormModal({ product, onClose, onSubmit }: Props) {
  const isEdit = product !== null;

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError("");

    const trimmedName = name.trim();
    const priceNumber = Number(price);

    const nameMessage = trimmedName === "" ? "Nama produk wajib diisi." : "";
    const priceMessage =
      price.trim() === "" || !Number.isInteger(priceNumber) || priceNumber <= 0
        ? "Harga harus lebih dari 0."
        : "";

    setNameError(nameMessage);
    setPriceError(priceMessage);
    if (nameMessage || priceMessage) return;

    setSubmitting(true);
    try {
      await onSubmit({ name: trimmedName, price: priceNumber });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Terjadi kesalahan.");
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">{isEdit ? "Edit Produk" : "Tambah Produk"}</h2>
      <p className="modal-subtitle">
        {isEdit ? "Perbarui informasi produk yang dipilih." : "Masukkan informasi produk baru."}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {product && <p className="modal-id">ID: {product.id}</p>}

        <label className="field">
          <span className="label">Nama Produk</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Contoh: Pulpen"
            autoFocus
          />
          {nameError && <small className="hint error">{nameError}</small>}
        </label>

        <label className="field">
          <span className="label">Harga (Rp)</span>
          <input
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Contoh: 5000"
            min="1"
            step="1"
          />
          <small className={priceError ? "hint error" : "hint"}>
            {priceError || "Harga harus lebih dari 0."}
          </small>
        </label>

        {apiError && <p className="alert">{apiError}</p>}

        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
            Batal
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Produk"}
          </button>
        </div>
      </form>
    </Modal>
  );
}