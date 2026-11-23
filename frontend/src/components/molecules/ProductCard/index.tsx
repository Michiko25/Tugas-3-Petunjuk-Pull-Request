import type { Product } from "../../../types/product"
import { TbPackage } from "react-icons/tb"
import Button from "../../atoms/Button"
import { formatRupiah } from "../../../utils/formatRupiah"
import styles from "./styles.module.css"

type Props = { product: Product; onSelect: (id: number) => void }

export default function ProductCard({ product, onSelect }: Props) {
    return (
        <article className={styles.card}>
            <div className={styles.header}>
                <span className={styles.id}>ID: {product.id}</span>
                <TbPackage className={styles.icon} aria-hidden="true" />
            </div>
            <h2 className={styles.name}>{product.name}</h2>
            <p className={styles.price}>{formatRupiah(product.price)}</p>
            <Button onClick={() => onSelect(product.id)}>Pilih produk</Button>
        </article>
    )
}
