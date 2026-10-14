import { Routes, Route } from "react-router-dom";
import Layout from "./ui/Layout";
import Home from "./views/Home";
import Shop from "./views/Shop";
import Product from "./views/Product";
import Cart from "./views/Cart";
import Account from "./views/Account";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
