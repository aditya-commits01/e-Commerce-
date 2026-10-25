import { Link } from "react-router-dom";
import { rupees } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ p }) {
  const { add } = useCart();
  return (
    <article className="card">
      <Link to={`/product/${p._id}`}>
        <img src={p.image} alt={p.name} loading="lazy" />
        <h3>{p.name}</h3>
      </Link>
      <div className="row">
        <strong>{rupees(p.price)}</strong>
        {p.stock > 0 ? (
          <button className="btn small" onClick={() => add(p)}>Add to cart</button>
        ) : (
          <span className="muted">Out of stock</span>
        )}
      </div>
    </article>
  );
}
