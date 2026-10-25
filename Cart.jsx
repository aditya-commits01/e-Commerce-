import { Link } from "react-router-dom";
import { rupees } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, setQty, remove, total } = useCart();

  if (items.length === 0)
    return <main className="page"><h1>Your cart is empty</h1><Link to="/" className="btn">Browse products</Link></main>;

  return (
    <main className="page">
      <h1>Your cart</h1>
      {items.map((i) => (
        <div className="line" key={i._id}>
          <img src={i.image} alt="" />
          <div className="grow"><strong>{i.name}</strong><div className="muted">{rupees(i.price)} each</div></div>
          <input type="number" min="1" max={i.stock} value={i.qty} onChange={(e) => setQty(i._id, Number(e.target.value))} className="qty" />
          <strong>{rupees(i.price * i.qty)}</strong>
          <button className="link" onClick={() => remove(i._id)}>Remove</button>
        </div>
      ))}
      <div className="summary">
        <span>Total</span><strong>{rupees(total)}</strong>
      </div>
      <Link to="/checkout" className="btn">Continue to checkout</Link>
    </main>
  );
}
