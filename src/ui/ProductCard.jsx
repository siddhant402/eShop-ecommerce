import { Link } from "react-router-dom";
import Picture from "./Picture";
import { formatPrice } from "../config";

export default function ProductCard({ product, tone = 0 }) {
  return (
    <Link to={`/product/${product.id}`} className="card">
      <Picture src={product.image} alt={product.name} tone={tone} />
      <div className="card__row">
        <span>{product.name}</span>
        <span>{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}
