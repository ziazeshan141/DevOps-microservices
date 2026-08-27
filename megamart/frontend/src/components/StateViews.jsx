export function LoadingGrid({ count = 4 }) {
  return <div className="product-grid">{Array.from({ length: count }, (_, i) => <div className="skeleton-card" key={i}><div className="skeleton media" /><div className="skeleton line" /><div className="skeleton line short" /><div className="skeleton button" /></div>)}</div>;
}

export function EmptyState({ title, text, action }) {
  return <div className="empty-state"><div className="empty-icon">◇</div><h2>{title}</h2><p>{text}</p>{action}</div>;
}

export function ErrorBanner({ error }) {
  if (!error) return null;
  return <div className="error-banner"><strong>Couldn’t load this section.</strong><span>{error.message || String(error)}</span></div>;
}
