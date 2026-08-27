import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductVisual from '../components/ProductVisual';
import { ErrorBanner } from '../components/StateViews';
import { commerceApi, getProductBundle } from '../api/commerce';
import { useAuth } from '../context/AuthContext';

const money = (v, c = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency: c }).format(Number(v || 0));

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, title: '', body: '' });

  useEffect(() => {
    Promise.all([getProductBundle(id), commerceApi.reviews(id).catch(() => [])])
      .then(([b, r]) => { setBundle(b); setReviews(r); })
      .catch(setError);
  }, [id]);

  if (error) return <div className="page container"><ErrorBanner error={error} /></div>;
  if (!bundle) return <div className="page-center"><div className="spinner" /></div>;
  const { product, price, media, rating, inventory } = bundle;
  const effective = price?.effective_price ?? price?.sale_price ?? price?.base_price;

  const add = async () => {
    if (!user) return navigate('/login');
    try { await commerceApi.addCart(id, quantity); navigate('/cart'); } catch (e) { alert(e.message); }
  };
  const submitReview = async (event) => {
    event.preventDefault();
    try {
      await commerceApi.addReview({ productId: id, ...review, rating: Number(review.rating) });
      await commerceApi.rate(id, Number(review.rating));
      setReviews(await commerceApi.reviews(id));
      setReview({ rating: 5, title: '', body: '' });
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="page container">
      <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to="/products">Products</Link><span>/</span>{product.name}</div>
      <section className="product-detail-grid">
        <div className="detail-visual"><ProductVisual product={product} media={media} /></div>
        <div className="detail-info">
          <span className="eyebrow dark">{product.brand || 'MegaMart'}</span>
          <h1>{product.name}</h1>
          <div className="rating-row large"><span className="stars">★★★★★</span><span>{Number(rating?.average || 0).toFixed(1)} · {rating?.count || 0} ratings</span></div>
          <p className="detail-description">{product.description || 'A MegaMart catalog product ready for pricing, inventory, reviews and checkout orchestration.'}</p>
          <div className="detail-price">{price ? money(effective, price.currency) : 'Price not configured'}</div>
          <div className={`stock-pill ${Number(inventory?.available_quantity ?? inventory?.quantity ?? 0) > 0 ? 'in-stock' : ''}`}>{inventory ? `${inventory.available_quantity ?? inventory.quantity ?? 0} available` : 'Inventory not configured'}</div>
          <div className="purchase-row"><input type="number" min="1" max="20" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} /><button className="btn btn-primary btn-large" onClick={add}>Add to cart</button><button className="btn btn-secondary" onClick={() => user ? commerceApi.addWishlist(id).then(() => alert('Added to wishlist')) : navigate('/login')}>♡ Wishlist</button></div>
          <div className="detail-assurances"><span>▣ Order tracking</span><span>♙ Fraud screening</span><span>◎ Notification events</span></div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="section-heading"><div><span className="eyebrow dark">Community</span><h2>Customer reviews</h2></div></div>
        {reviews.length ? <div className="review-list">{reviews.map((r) => <article className="review-card" key={r.id}><div className="stars">{'★'.repeat(Number(r.rating || 0))}{'☆'.repeat(Math.max(0, 5 - Number(r.rating || 0)))}</div><h3>{r.title || 'Customer review'}</h3><p>{r.body}</p><small>{new Date(r.created_at).toLocaleDateString()}</small></article>)}</div> : <p className="muted">No published reviews yet.</p>}
        {user && <form className="review-form panel" onSubmit={submitReview}><h3>Write a review</h3><div className="form-grid"><label>Rating<select value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select></label><label>Title<input value={review.title} onChange={(e) => setReview({ ...review, title: e.target.value })} /></label></div><label>Review<textarea rows="4" value={review.body} onChange={(e) => setReview({ ...review, body: e.target.value })} /></label><button className="btn btn-primary" type="submit">Submit review</button></form>}
      </section>
    </div>
  );
}
