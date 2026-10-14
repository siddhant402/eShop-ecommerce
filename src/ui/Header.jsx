import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";

export default function Header() {
  const { isLoggedIn, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const logout = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className="header">
      <Link to="/" className="brand">eShop</Link>
      <nav className="header__nav" aria-label="Main">
        <NavLink to="/shop">Shop</NavLink>
        <Link to="/#categories">Categories</Link>
      </nav>
      <nav className="header__nav" aria-label="Account">
        {isLoggedIn ? (
          <button type="button" className="link-button" onClick={logout}>Sign out</button>
        ) : (
          <NavLink to="/account">Account</NavLink>
        )}
        <NavLink to="/cart">Cart ({count})</NavLink>
      </nav>
    </header>
  );
}
