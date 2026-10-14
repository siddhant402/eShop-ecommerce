import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../state/CartContext";
import { formatPrice } from "../config";
import Picture from "../ui/Picture";
import { Empty } from "../ui/State";

export default function Cart() {
  const { items, subtotal, setQty, remove } = useCart();
  const [notice, setNotice] = useState("");

  return (
    <div className="container section">
      <h1 className="display display--page">Your cart</h1>

      {items.length === 0 ? (
        <>
          <Empty>Your cart is empty.</Empty>
          <Link to="/shop" className="link-underline">Continue shopping</Link>
        </>
      ) : (
        <div className="cart">
          <div className="cart__lines">
            {items.map((i, idx) => (
              <div key={i.id} className="line">
                <div className="line__img"><Picture src={i.image} alt={i.name} tone={idx} /></div>
                <div className="line__info">
                  <Link to={`/product/${i.id}`}>{i.name}</Link>
                  <button type="button" className="link-button link-button--muted" onClick={() => remove(i.id)}>Remove</button>
                </div>
                <div className="line__side">
                  <span>{formatPrice(i.price * i.qty)}</span>
                  <div className="qty qty--small">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQty(i.id, i.qty - 1)}>-</button>
                    <span>{i.qty}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/shop" className="link-underline cart__continue">Continue shopping</Link>
          </div>

          <aside className="summary">
            <h2 className="title title--small">Order summary</h2>
            <div className="summary__row"><span className="muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary__row"><span className="muted">Shipping</span><span>At checkout</span></div>
            <div className="summary__row summary__row--total"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
            <button type="button" className="btn btn--solid" onClick={() => setNotice("Checkout is not available yet. The backend has no orders API.")}>
              Checkout
            </button>
            {notice && <p className="note" role="status">{notice}</p>}
          </aside>
        </div>
      )}
    </div>
  );
}
