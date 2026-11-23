import { TbPackage } from "react-icons/tb"
import type { Product } from "../../../types/product"
import { formatRupiah } from "../../../utils/formatRupiah"
import styles from "./styles.module.css"

type Props = { product: Product }

export default function ProductDetail({ product }: Props) {
    return (
        <article className={styles.card}>
            <div className={styles.header}>
                <div className={styles.iconWrap}>
                    <TbPackage className={styles.icon} aria-hidden="true" />
                </div>
                <div className={styles.heading}>
                    <p className={styles.eyebrow}>Detail produk</p>
                    <h1 className={styles.name}>{product.name}</h1>
                </div>
            </div>
            <dl className={styles.list}>
                <div className={styles.row}>
                    <dt className={styles.term}>ID produk</dt>
                    <dd className={styles.value}>{product.id}</dd>
                </div>
                <div className={styles.row}>
                    <dt className={styles.term}>Nama produk</dt>
                    <dd className={styles.value}>{product.name}</dd>
                </div>
                <div className={styles.row}>
                    <dt className={styles.term}>Harga</dt>
                    <dd className={styles.price}>{formatRupiah(product.price)}</dd>
                </div>
            </dl>
        </article>
    )
}