import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <header className="nav">
      <Link to="/" className="brand">ShopKart</Link>
      <nav>
        <Link to="/cart">Cart{count > 0 && <span className="badge">{count}</span>}</Link>
        {user ? (
          <>
            <Link to="/orders">My orders</Link>
            {user.isAdmin && <Link to="/admin">Admin</Link>}
            <button className="link" onClick={() => { logout(); navigate("/"); }}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn small">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
