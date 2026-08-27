const palette = ['#eaf2ff', '#f4ebff', '#e9fbf4', '#fff3e8', '#fff1f5', '#eef8ff'];

export default function ProductVisual({ product, media, className = '' }) {
  const image = media?.find((item) => item.media_type === 'image')?.url || media?.[0]?.url;
  const index = [...String(product?.name || 'MegaMart')].reduce((n, c) => n + c.charCodeAt(0), 0) % palette.length;
  if (image) return <img className={`product-image ${className}`} src={image} alt={media?.[0]?.alt_text || product?.name || 'Product'} />;
  return (
    <div className={`product-placeholder ${className}`} style={{ background: palette[index] }}>
      <span>{product?.name?.slice(0, 1)?.toUpperCase() || 'M'}</span>
      <small>{product?.brand || 'MegaMart'}</small>
    </div>
  );
}
