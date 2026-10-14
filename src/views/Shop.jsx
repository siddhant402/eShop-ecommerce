import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useFetch from "../api/useFetch";
import { getCategories, getProducts } from "../api/shop";
import ProductCard from "../ui/ProductCard";
import { Loading, ErrorNote, Empty } from "../ui/State";

const SORTS = {
  featured: () => 0,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  const [sort, setSort] = useState("featured");

  const cats = useFetch(getCategories, []);
  const prods = useFetch(() => getProducts(category), [category]);

  const list = useMemo(
    () => [...(prods.data ?? [])].sort(SORTS[sort]),
    [prods.data, sort]
  );

  const pick = (id) => setParams(id ? { category: id } : {});

  return (
    <div className="container section">
      <p className="crumbs"><Link to="/">Home</Link> / Shop</p>
      <h1 className="display display--page">All products</h1>

      <div className="toolbar">
        <div className="chips">
          <button type="button" className={`chip ${!category ? "chip--on" : ""}`} onClick={() => pick(null)}>All</button>
          {cats.data?.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip ${String(c.id) === category ? "chip--on" : ""}`}
              onClick={() => pick(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="sort">
          <span className="muted">{list.length} products</span>
          <label htmlFor="sort" className="muted">Sort</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {prods.loading && <Loading />}
      {prods.error && <ErrorNote error={prods.error} />}
      {!prods.loading && !prods.error && list.length === 0 && <Empty>No products found.</Empty>}
      <div className="grid grid--prod grid--shop">
        {list.map((p, i) => <ProductCard key={p.id} product={p} tone={i} />)}
      </div>
    </div>
  );
}
