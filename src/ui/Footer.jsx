import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <span className="brand brand--small">eShop</span>
      <nav className="footer__nav" aria-label="Footer">
        <Link to="/shop">Shop</Link>
        <Link to="/account">Account</Link>
        <Link to="/cart">Cart</Link>
      </nav>
      <span>© {new Date().getFullYear()} eShop</span>
    </footer>
  );
}
