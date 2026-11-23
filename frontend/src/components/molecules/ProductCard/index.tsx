import { TbPackage } from "react-icons/tb"
import type { Product } from "../../../types/product"
import { formatRupiah } from "../../../utils/formatRupiah"
import Button from "../../atoms/Button"
import LinkButton from "../../atoms/LinkButton"
import styles from "./styles.module.css"

type Props = {
    product: Product
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
    return (
        <article className={styles.card}>
            <div className={styles.header}>
                <span className={styles.id}>ID: {product.id}</span>
                <TbPackage className={styles.icon} aria-hidden="true" />
            </div>
            <h2 className={styles.name}>{product.name}</h2>
            <p className={styles.price}>{formatRupiah(product.price)}</p>
            <div className={styles.actions}>
                <LinkButton
                    to={`/products/${product.id}`}
                    variant="secondary"
                    aria-label={`Lihat detail ${product.name}`}
                >
                    Detail
                </LinkButton>
                <Button
                    variant="secondary"
                    aria-label={`Edit ${product.name}`}
                    onClick={() => onEdit(product)}
                >
                    Edit
                </Button>
                <Button
                    variant="subtleDanger"
                    aria-label={`Hapus ${product.name}`}
                    onClick={() => onDelete(product)}
                >
                    Hapus
                </Button>
            </div>
        </article>
    )
}