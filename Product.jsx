import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, rupees } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => { api(`/products/${id}`).then(setP).catch((e) => setError(e.message)); }, [id]);

  if (error) return <main className="page"><p className="error">{error}</p></main>;
  if (!p) return <main className="page"><p className="muted">Loading...</p></main>;

  return (
    <main className="page detail">
      <img src={p.image} alt={p.name} />
      <div>
        <h1>{p.name}</h1>
        <p className="price">{rupees(p.price)}</p>
        <p>{p.description}</p>
        <p className="muted">{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</p>
        {p.stock > 0 && (
          <div className="row">
            <input type="number" min="1" max={p.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="qty" />
            <button className="btn" onClick={() => add(p, qty)}>Add to cart</button>
          </div>
        )}
      </div>
    </main>
  );
}
