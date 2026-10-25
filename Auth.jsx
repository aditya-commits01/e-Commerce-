import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth({ mode }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page narrow">
      <h1>{isLogin ? "Log in" : "Create your account"}</h1>
      <form onSubmit={submit} className="form">
        {!isLogin && <label>Name<input required value={form.name} onChange={set("name")} /></label>}
        <label>Email<input type="email" required value={form.email} onChange={set("email")} /></label>
        <label>Password<input type="password" required minLength={6} value={form.password} onChange={set("password")} /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? "Please wait..." : isLogin ? "Log in" : "Sign up"}</button>
      </form>
      <p className="muted">
        {isLogin ? <>New here? <Link to="/register">Create an account</Link></> : <>Already registered? <Link to="/login">Log in</Link></>}
      </p>
    </main>
  );
}
