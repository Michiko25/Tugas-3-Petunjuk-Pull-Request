import type { Product } from "../../../types/product"
import ProductCard from "../../molecules/ProductCard"
import styles from "./styles.module.css"

type Props = { products: Product[]; onSelect: (id: number) => void }

export default function ProductGrid({ products, onSelect }: Props) {
    return (
        <div className={styles.grid}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelect}
                />
            ))}
        </div>
    )
}
