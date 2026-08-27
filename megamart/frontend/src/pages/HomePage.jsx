import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ErrorBanner, LoadingGrid } from '../components/StateViews';
import { commerceApi, hydrateProducts } from '../api/commerce';

const categoryFallback = ['Electronics', 'Home & Kitchen', 'Beauty & Personal Care', 'Sports & Outdoors', 'Books & Media', 'Fashion'];
const icons = ['⌁', '⌂', '✦', '◒', '▤', '♢'];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      commerceApi.recommendations(8).catch(() => commerceApi.products(8)),
      commerceApi.categories().catch(() => []),
    ])
      .then(async ([recs, cats]) => {
        setProducts(await hydrateProducts(Array.isArray(recs) ? recs : recs?.items || []));
        setCategories(cats || []);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const shownCategories = categories.length ? categories.slice(0, 6).map((c) => c.name) : categoryFallback;

  return (
    <div>
      <section className="hero-wrap container">
        <div className="hero-copy">
          <span className="eyebrow">Mega savings week</span>
          <h1>Great Deals.<br />Every Day.</h1>
          <p>Discover everyday essentials, new arrivals and customer favorites—all through your microservices storefront.</p>
          <div className="hero-actions"><Link className="btn btn-light" to="/products">Shop now</Link><Link className="btn btn-ghost-light" to="/products">Browse deals</Link></div>
          <div className="hero-meta"><span>✓ Easy checkout</span><span>✓ Order tracking</span><span>✓ Secure JWT sessions</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="parcel parcel-a">M</div><div className="parcel parcel-b">⌁</div><div className="parcel parcel-c">✦</div>
          <div className="hero-card-mini"><strong>24</strong><span>backend services</span></div>
        </div>
      </section>

      <section className="benefits container">
        <div><b>▣</b><span><strong>Fast delivery flow</strong><small>Shipping service ready</small></span></div>
        <div><b>↺</b><span><strong>Easy order handling</strong><small>Track and cancel orders</small></span></div>
        <div><b>♙</b><span><strong>Secure checkout</strong><small>Fraud and payment orchestration</small></span></div>
        <div><b>◎</b><span><strong>Customer support</strong><small>Profile and notification ready</small></span></div>
      </section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow dark">Shop by category</span><h2>Find what you need</h2></div><Link to="/products">View all →</Link></div>
        <div className="category-grid">{shownCategories.map((name, index) => <Link key={name} to={`/products?q=${encodeURIComponent(name)}`} className="category-card"><span>{icons[index % icons.length]}</span><strong>{name}</strong><small>Explore collection</small></Link>)}</div>
      </section>

      <section className="section container">
        <div className="section-heading"><div><span className="eyebrow dark">Recommended</span><h2>Top picks for you</h2></div><Link to="/products">See all products →</Link></div>
        <ErrorBanner error={error} />
        {loading ? <LoadingGrid count={4} /> : products.length ? <div className="product-grid">{products.map((bundle) => <ProductCard key={bundle.product.id} bundle={bundle} />)}</div> : <div className="catalog-empty-inline">Your catalog is empty. Add products through the admin APIs and they’ll appear here automatically.</div>}
      </section>
    </div>
  );
}
