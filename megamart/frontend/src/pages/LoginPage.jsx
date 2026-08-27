import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try { await login(form); navigate(location.state?.from || '/'); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <AuthShell title="Welcome back" subtitle="Sign in to continue shopping, track orders and checkout."><form className="auth-form" onSubmit={submit}>{error && <div className="form-error">{error}</div>}<label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 8 characters" /></label><button className="btn btn-primary btn-large" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button><p className="auth-switch">New to MegaMart? <Link to="/register">Create an account</Link></p></form></AuthShell>;
}

export function AuthShell({ title, subtitle, children }) {
  return <div className="auth-page"><div className="auth-showcase"><div className="brand auth-brand"><span className="brand-mark">M</span><span>MegaMart</span></div><span className="eyebrow">One storefront. 24 services.</span><h1>Commerce built for your DevOps journey.</h1><p>Browse, authenticate, add to cart, orchestrate checkout and track orders through the same API Gateway.</p><div className="auth-service-cloud"><span>Auth</span><span>Cart</span><span>Orders</span><span>Payment</span><span>Shipping</span><span>Analytics</span></div></div><div className="auth-panel"><div className="auth-card"><h2>{title}</h2><p>{subtitle}</p>{children}</div></div></div>;
}
