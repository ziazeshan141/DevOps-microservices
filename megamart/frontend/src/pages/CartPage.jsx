import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductVisual from '../components/ProductVisual';
import { EmptyState, ErrorBanner } from '../components/StateViews';
import { commerceApi, getProductBundle } from '../api/commerce';

const money = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v || 0));

export default function CartPage() {
  const [items, setItems] = useState([]); const [error, setError] = useState(null); const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { const cart = await commerceApi.cart(); const rows = await Promise.all((cart.items || []).map(async (item) => ({ ...item, bundle: await getProductBundle(item.product_id) }))); setItems(rows); } catch (e) { setError(e); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const change = async (id, qty) => { if (qty < 1) return; await commerceApi.setCart(id, qty); load(); };
  const remove = async (id) => { await commerceApi.removeCart(id); load(); };
  const subtotal = items.reduce((sum, x) => sum + Number(x.bundle.price?.effective_price ?? x.bundle.price?.base_price ?? 0) * Number(x.quantity), 0);
  if (loading) return <div className="page-center"><div className="spinner" /></div>;
  return <div className="page container"><div className="page-title-row"><div><span className="eyebrow dark">Shopping bag</span><h1>Your cart</h1><p>{items.length} unique items</p></div></div><ErrorBanner error={error} />{!items.length ? <EmptyState title="Your cart is empty" text="Browse the catalog and add something you like." action={<Link className="btn btn-primary" to="/products">Start shopping</Link>} /> : <div className="cart-layout"><div className="cart-items">{items.map((item) => { const { product, price, media } = item.bundle; const unit = Number(price?.effective_price ?? price?.base_price ?? 0); return <article className="cart-item" key={item.product_id}><div className="cart-visual"><ProductVisual product={product} media={media} /></div><div className="cart-info"><Link to={`/products/${product.id}`}>{product.name}</Link><small>{product.brand || 'MegaMart'}</small><div className="cart-controls"><button onClick={() => change(product.id, Number(item.quantity)-1)}>−</button><span>{item.quantity}</span><button onClick={() => change(product.id, Number(item.quantity)+1)}>+</button><button className="remove-link" onClick={() => remove(product.id)}>Remove</button></div></div><strong>{money(unit * Number(item.quantity))}</strong></article>; })}</div><aside className="summary-card"><h2>Order summary</h2><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Estimated delivery</span><strong>Calculated at checkout</strong></div><hr /><div className="summary-total"><span>Estimated total</span><strong>{money(subtotal)}</strong></div><Link className="btn btn-primary btn-large" to="/checkout">Proceed to checkout</Link><button className="link-button center" onClick={() => commerceApi.clearCart().then(load)}>Clear cart</button></aside></div>}</div>;
}
