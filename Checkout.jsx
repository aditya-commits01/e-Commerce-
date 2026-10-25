import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, rupees } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: "", city: "", pincode: "", phone: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!user) return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
  if (items.length === 0) return <Navigate to="/cart" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/orders", {
        method: "POST",
        body: { items: items.map((i) => ({ product: i._id, qty: i.qty })), shipping: form, paymentMethod: "COD" },
      });
      clear();
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page narrow">
      <h1>Shipping details</h1>
      <form onSubmit={submit} className="form">
        <label>Address<input required value={form.address} onChange={set("address")} /></label>
        <label>City<input required value={form.city} onChange={set("city")} /></label>
        <label>Pincode<input required pattern="[0-9]{6}" title="6-digit pincode" value={form.pincode} onChange={set("pincode")} /></label>
        <label>Phone<input required pattern="[0-9]{10}" title="10-digit phone number" value={form.phone} onChange={set("phone")} /></label>
        <p className="muted">Payment: cash on delivery</p>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? "Placing order..." : `Place order, ${rupees(total)}`}</button>
      </form>
    </main>
  );
}
