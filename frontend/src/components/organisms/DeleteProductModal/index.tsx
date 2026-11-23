import { useState } from "react"
import { TbTrash } from "react-icons/tb"
import type { Product } from "../../../types/product"
import { formatRupiah } from "../../../utils/formatRupiah"
import { getErrorMessage } from "../../../utils/getErrorMessage"
import Alert from "../../atoms/Alert"
import Button from "../../atoms/Button"
import Modal from "../../molecules/Modal"
import styles from "./styles.module.css"

type Props = {
    product: Product
    onClose: () => void
    onConfirm: () => Promise<void>
}

export default function DeleteProductModal({ product, onClose, onConfirm }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")

    async function handleConfirm() {
        setIsSubmitting(true)
        setSubmitError("")
        try {
            await onConfirm()
        } catch (error) {
            setSubmitError(getErrorMessage(error))
            setIsSubmitting(false)
        }
    }

    return (
        <Modal
            title="Hapus Produk?"
            description="Produk yang dihapus tidak dapat dikembalikan."
            icon={<TbTrash aria-hidden="true" />}
            centered
            onClose={onClose}
        >
            <div className={styles.info}>
                <span className={styles.id}>ID: {product.id}</span>
                <strong className={styles.name}>{product.name}</strong>
                <span className={styles.price}>{formatRupiah(product.price)}</span>
            </div>

            {submitError && (
                <div className={styles.alert}>
                    <Alert variant="error">{submitError}</Alert>
                </div>
            )}

            <div className={styles.actions}>
                <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                    Batal
                </Button>
                <Button variant="danger" onClick={handleConfirm} disabled={isSubmitting}>
                    {isSubmitting ? "Menghapus..." : "Hapus Produk"}
                </Button>
            </div>
        </Modal>
    )
}