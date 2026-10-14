import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../api/useFetch";
import { getProduct } from "../api/shop";
import { useCart } from "../state/CartContext";
import { formatPrice } from "../config";
import Picture from "../ui/Picture";
import { Loading, ErrorNote, Empty } from "../ui/State";

export default function Product() {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(() => getProduct(id), [id]);
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  if (loading) return <div className="container section"><Loading /></div>;
  if (error) return <div className="container section"><ErrorNote error={error} /></div>;
  if (!product) return <div className="container section"><Empty>Product not found.</Empty></div>;

  const addToCart = () => {
    add(product, qty);
    navigate("/cart");
  };

  return (
    <div className="container section">
      <p className="crumbs"><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / {product.name}</p>
      <div className="detail">
        <div className="detail__media">
          <Picture src={product.image} alt={product.name} />
        </div>
        <div className="detail__info">
          <h1 className="display display--product">{product.name}</h1>
          <span className="price">{formatPrice(product.price)}</span>
          {product.description && <p className="lead lead--body">{product.description}</p>}

          <div className="buy">
            <div className="qty">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <span>{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button type="button" className="btn btn--solid btn--grow" onClick={addToCart}>Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
