import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useFetch from "../api/useFetch";
import { getCategories, getProducts } from "../api/shop";
import Picture from "../ui/Picture";
import ProductCard from "../ui/ProductCard";
import HeroSlider from "../ui/HeroSlider";
import { Loading, ErrorNote, Empty } from "../ui/State";

export default function Home() {
  const { hash } = useLocation();
  const cats = useFetch(getCategories, []);
  const prods = useFetch(() => getProducts(), []);

  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView();
  }, [hash, cats.data]);

  return (
    <>
      <section className="container hero">
        <div className="hero__text">
          <p className="eyebrow">New collection</p>
          <h1 className="display">Considered goods for everyday life.</h1>
          <p className="lead">A small, carefully chosen range. Nothing you do not need.</p>
          <div className="actions">
            <Link to="/shop" className="btn btn--solid">Shop the collection</Link>
            <a href="#categories" className="link-underline">View categories</a>
          </div>
        </div>
        <HeroSlider products={prods.data} />
      </section>

      <section className="container section" id="categories">
        <div className="section__head">
          <h2 className="title">Shop by category</h2>
          <Link to="/shop" className="link-underline">All products</Link>
        </div>
        {cats.loading && <Loading />}
        {cats.error && <ErrorNote error={cats.error} />}
        {cats.data?.length === 0 && <Empty>No categories yet.</Empty>}
        <div className="grid grid--cat">
          {cats.data?.map((c, i) => (
            <Link key={c.id} to={`/shop?category=${c.id}`} className="card">
              <Picture src={c.image} alt={c.name} ratio="4 / 3" tone={i} />
              <div className="card__row"><span>{c.name}</span><span className="muted">Explore</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section__head">
          <h2 className="title">Featured</h2>
          <Link to="/shop" className="link-underline">View all</Link>
        </div>
        {prods.loading && <Loading />}
        {prods.error && <ErrorNote error={prods.error} />}
        {prods.data?.length === 0 && <Empty>No products yet.</Empty>}
        <div className="grid grid--prod">
          {prods.data?.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} tone={i} />)}
        </div>
      </section>

      <section className="strip">
        <div className="container strip__grid">
          <div><h3>Shipping</h3><p>Shipping details go here.</p></div>
          <div><h3>Returns</h3><p>Returns policy goes here.</p></div>
          <div><h3>Support</h3><p>Support hours and contact go here.</p></div>
        </div>
      </section>
    </>
  );
}
