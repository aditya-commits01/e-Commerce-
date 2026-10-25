import { useEffect, useState } from "react";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [data, setData] = useState({ items: [], pages: 1 });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { api("/products/categories").then(setCategories).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({ category, sort, page, ...(search ? { search } : {}) });
    const t = setTimeout(() => {
      api(`/products?${q}`)
        .then((d) => { setData(d); setError(""); })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250); // debounce typing
    return () => clearTimeout(t);
  }, [search, category, sort, page]);

  return (
    <main className="page">
      <div className="filters">
        <input placeholder="Search products" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? <p className="muted">Loading products...</p> : data.items.length === 0 ? (
        <p className="muted">No products match your search. Try a different word or category.</p>
      ) : (
        <div className="grid">{data.items.map((p) => <ProductCard key={p._id} p={p} />)}</div>
      )}

      {data.pages > 1 && (
        <div className="pager">
          <button className="btn small ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {data.pages}</span>
          <button className="btn small ghost" disabled={page === data.pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </main>
  );
}
