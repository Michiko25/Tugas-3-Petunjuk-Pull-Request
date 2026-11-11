import type { Product } from "../types";
import { formatRupiah } from "../utils";

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <article className="card">
      <span className="card-id">ID: {product.id}</span>
      <h3 className="card-name">{product.name}</h3>
      <p className="card-price">{formatRupiah(product.price)}</p>
      <div className="card-actions">
        <button type="button" className="btn btn-outline" onClick={() => onEdit(product)}>
          Edit
        </button>
        <button type="button" className="btn btn-outline-danger" onClick={() => onDelete(product)}>
          Hapus
        </button>
      </div>
    </article>
  );
}