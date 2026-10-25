import { useEffect, useState } from "react";
import { api, rupees } from "../api.js";

const empty = { name: "", price: "", category: "", stock: "", image: "", description: "" };

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    api("/products?limit=100").then((d) => setProducts(d.items)).catch((e) => setError(e.message));
    api("/orders").then(setOrders).catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editId) await api(`/products/${editId}`, { method: "PUT", body });
      else await api("/products", { method: "POST", body });
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) { setError(err.message); }
  };

  const edit = (p) => { setEditId(p._id); setForm({ ...p, price: String(p.price), stock: String(p.stock) }); window.scrollTo(0, 0); };
  const del = async (id) => { if (confirm("Delete this product?")) { await api(`/products/${id}`, { method: "DELETE" }); load(); } };
  const setStatus = async (id, status) => { await api(`/orders/${id}/status`, { method: "PATCH", body: { status } }); load(); };

  return (
    <main className="page">
      <h1>Admin</h1>
      <div className="tabs">
        <button className={tab === "products" ? "on" : ""} onClick={() => setTab("products")}>Products</button>
        <button className={tab === "orders" ? "on" : ""} onClick={() => setTab("orders")}>Orders ({orders.length})</button>
      </div>
      {error && <p className="error">{error}</p>}

      {tab === "products" ? (
        <>
          <form onSubmit={save} className="form inline">
            <input required placeholder="Name" value={form.name} onChange={set("name")} />
            <input required type="number" min="0" placeholder="Price" value={form.price} onChange={set("price")} />
            <input placeholder="Category" value={form.category} onChange={set("category")} />
            <input required type="number" min="0" placeholder="Stock" value={form.stock} onChange={set("stock")} />
            <input placeholder="Image URL" value={form.image} onChange={set("image")} />
            <input placeholder="Description" value={form.description} onChange={set("description")} />
            <button className="btn">{editId ? "Save changes" : "Add product"}</button>
            {editId && <button type="button" className="btn ghost" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
          </form>
          <div className="table">
            {products.map((p) => (
              <div className="line" key={p._id}>
                <img src={p.image} alt="" />
                <div className="grow"><strong>{p.name}</strong><div className="muted">{p.category} · {p.stock} in stock</div></div>
                <strong>{rupees(p.price)}</strong>
                <button className="link" onClick={() => edit(p)}>Edit</button>
                <button className="link danger" onClick={() => del(p._id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        orders.map((o) => (
          <section className="order" key={o._id}>
            <div className="row">
              <span>{o.user?.name} ({o.user?.email})</span>
              <strong>{rupees(o.total)}</strong>
              <select value={o.status} onChange={(e) => setStatus(o._id, e.target.value)}>
                {["placed", "shipped", "delivered", "cancelled"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <ul>{o.items.map((i) => <li key={i.product}>{i.qty} x {i.name}</li>)}</ul>
            <div className="muted">{o.shipping?.address}, {o.shipping?.city} {o.shipping?.pincode} · {o.shipping?.phone}</div>
          </section>
        ))
      )}
    </main>
  );
}
