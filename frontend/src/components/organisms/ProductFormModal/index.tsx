import { useState } from "react";
import type { FormEvent } from "react";
import type { Product, ProductValues } from "../../../types/product";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import Alert from "../../atoms/Alert";
import Button from "../../atoms/Button";
import FormField from "../../molecules/FormField";
import Modal from "../../molecules/Modal";
import styles from "./styles.module.css";

type Props = {
  product: Product | null; // null = mode tambah, ada isinya = mode edit
  onClose: () => void;
  onSubmit: (values: ProductValues) => Promise<void>;
};

const MAX_PRICE = 2_000_000_000;

export default function ProductFormModal({
  product,
  onClose,
  onSubmit,
}: Props) {
  const isEdit = product !== null;

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    // Validasi di sisi frontend sebelum mengirim ke backend
    const trimmedName = name.trim();
    const priceNumber = Number(price);

    const nextNameError = trimmedName ? "" : "Nama produk wajib diisi.";
    let nextPriceError = "";
    if (
      price.trim() === "" ||
      !Number.isInteger(priceNumber) ||
      priceNumber <= 0
    ) {
      nextPriceError = "Harga harus berupa bilangan bulat lebih dari 0.";
    } else if (priceNumber > MAX_PRICE) {
      nextPriceError = "Harga terlalu besar.";
    }

    setNameError(nextNameError);
    setPriceError(nextPriceError);
    if (nextNameError || nextPriceError) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ name: trimmedName, price: priceNumber });
    } catch (error) {
      // Pesan dari backend ditampilkan di dalam pop-up
      setSubmitError(getErrorMessage(error));
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title={isEdit ? "Edit Produk" : "Tambah Produk"}
      description={
        isEdit
          ? "Perbarui informasi produk yang dipilih."
          : "Masukkan informasi produk baru."
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        {product && <p className={styles.id}>ID: {product.id}</p>}

        <FormField
          id="product-name"
          label="Nama Produk"
          placeholder="Contoh: Pulpen"
          value={name}
          error={nameError}
          onChange={(event) => setName(event.target.value)}
          autoFocus
        />
        <FormField
          id="product-price"
          label="Harga (Rp)"
          type="number"
          min="1"
          step="1"
          placeholder="Contoh: 5000"
          value={price}
          error={priceError}
          hint="Harga harus lebih dari 0."
          onChange={(event) => setPrice(event.target.value)}
        />

        {submitError && (
          <div className={styles.alert}>
            <Alert variant="error">{submitError}</Alert>
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Simpan Produk"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
