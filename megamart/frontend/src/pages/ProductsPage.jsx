import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { EmptyState, ErrorBanner, LoadingGrid } from '../components/StateViews';
import { commerceApi, hydrateProducts } from '../api/commerce';

export default function ProductsPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setLoading(true); setError(null);
    const source = query ? commerceApi.search(query).then((x) => x.items || []) : commerceApi.products(100);
    source.then(hydrateProducts).then(setItems).catch(setError).finally(() => setLoading(false));
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = q ? items.filter(({ product }) => [product.name, product.brand, product.description].some((v) => String(v || '').toLowerCase().includes(q))) : [...items];
    const value = (x) => Number(x.price?.effective_price ?? x.price?.sale_price ?? x.price?.base_price ?? 0);
    if (sort === 'price-low') list.sort((a, b) => value(a) - value(b));
    if (sort === 'price-high') list.sort((a, b) => value(b) - value(a));
    if (sort === 'rating') list.sort((a, b) => Number(b.rating?.average || 0) - Number(a.rating?.average || 0));
    return list;
  }, [items, query, sort]);

  return (
    <div className="page container">
      <div className="page-title-row"><div><span className="eyebrow dark">MegaMart catalog</span><h1>{query ? `Results for “${query}”` : 'All products'}</h1><p>{filtered.length} products found</p></div><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Newest</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option><option value="rating">Customer rating</option></select></div>
      <ErrorBanner error={error} />
      {loading ? <LoadingGrid count={8} /> : filtered.length ? <div className="product-grid">{filtered.map((bundle) => <ProductCard key={bundle.product.id} bundle={bundle} />)}</div> : <EmptyState title="No products found" text={query ? 'Try a different search term, or add matching products to the catalog.' : 'The product database is empty. Add your first product through the admin API.'} />}
    </div>
  );
}
