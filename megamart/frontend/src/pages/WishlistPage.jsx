import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { EmptyState, LoadingGrid } from '../components/StateViews';
import { commerceApi, getProductBundle } from '../api/commerce';

export default function WishlistPage() {
  const [items, setItems] = useState(null);
  const load = () => commerceApi.wishlist().then(async (rows) => setItems(await Promise.all(rows.map((x) => getProductBundle(x.product_id))))).catch(() => setItems([]));
  useEffect(load, []);
  if (!items) return <div className="page container"><LoadingGrid /></div>;
  return <div className="page container"><div className="page-title-row"><div><span className="eyebrow dark">Saved for later</span><h1>Your wishlist</h1></div></div>{items.length ? <div className="product-grid">{items.map((bundle) => <ProductCard key={bundle.product.id} bundle={bundle} wishlistMode onWishlist={load} />)}</div> : <EmptyState title="Nothing saved yet" text="Use the heart button on any product to keep it here." action={<Link className="btn btn-primary" to="/products">Explore products</Link>} />}</div>;
}
