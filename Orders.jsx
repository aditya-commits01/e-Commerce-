import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, rupees } from "../api.js";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { api("/orders/mine").then(setOrders).catch((e) => setError(e.message)); }, []);

  if (error) return <main className="page"><p className="error">{error}</p></main>;
  if (!orders) return <main className="page"><p className="muted">Loading...</p></main>;
  if (orders.length === 0)
    return <main className="page"><h1>No orders yet</h1><Link to="/" className="btn">Start shopping</Link></main>;

  return (
    <main className="page">
      <h1>My orders</h1>
      {orders.map((o) => (
        <section className="order" key={o._id}>
          <div className="row">
            <span>{new Date(o.createdAt).toLocaleDateString("en-IN")}</span>
            <span className={`status ${o.status}`}>{o.status}</span>
            <strong>{rupees(o.total)}</strong>
          </div>
          <ul>{o.items.map((i) => <li key={i.product}>{i.qty} x {i.name}</li>)}</ul>
        </section>
      ))}
    </main>
  );
}
