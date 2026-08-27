import { Link, useNavigate } from 'react-router-dom';
import ProductVisual from './ProductVisual';
import { commerceApi } from '../api/commerce';
import { useAuth } from '../context/AuthContext';

function money(value, currency = 'USD') {
  if (value === null || value === undefined) return 'Price pending';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(value));
}

export default function ProductCard({ bundle, onWishlist, wishlistMode = false }) {
  const { product, price, media, rating } = bundle;
  const { user } = useAuth();
  const navigate = useNavigate();
  const effective = price?.effective_price ?? price?.sale_price ?? price?.base_price;
  const hasSale = price?.sale_price && Number(price.sale_price) < Number(price.base_price);

  const addCart = async () => {
    if (!user) return navigate('/login');
    try { await commerceApi.addCart(product.id, 1); navigate('/cart'); } catch (e) { alert(e.message); }
  };

  const wishlist = async () => {
    if (!user) return navigate('/login');
    try { if (wishlistMode) await commerceApi.removeWishlist(product.id); else await commerceApi.addWishlist(product.id); onWishlist?.(product.id); } catch (e) { alert(e.message); }
  };

  return (
    <article className="product-card">
      <Link className="product-media" to={`/products/${product.id}`}>
        {hasSale && <span className="sale-badge">Sale</span>}
        <ProductVisual product={product} media={media} />
      </Link>
      <div className="product-body">
        <div className="product-brand">{product.brand || 'MegaMart selection'}</div>
        <Link className="product-name" to={`/products/${product.id}`}>{product.name}</Link>
        <div className="rating-row"><span className="stars">★★★★★</span><span>{Number(rating?.average || 0).toFixed(1)} ({rating?.count || 0})</span></div>
        <div className="price-row"><strong>{money(effective, price?.currency || 'USD')}</strong>{hasSale && <del>{money(price.base_price, price.currency)}</del>}</div>
        <div className="card-actions"><button className="btn btn-primary" onClick={addCart}>Add to cart</button><button className="icon-btn" aria-label={wishlistMode ? 'Remove from wishlist' : 'Add to wishlist'} onClick={wishlist}>{wishlistMode ? '♥' : '♡'}</button></div>
      </div>
    </article>
  );
}
