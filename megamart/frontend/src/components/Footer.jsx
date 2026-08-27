import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><div className="brand footer-brand"><span className="brand-mark">M</span><span>MegaMart</span></div><p>A portfolio-grade storefront backed by 24 independently deployable microservices.</p></div>
        <div><h4>Shop</h4><Link to="/products">Products</Link><Link to="/wishlist">Wishlist</Link><Link to="/cart">Cart</Link></div>
        <div><h4>Account</h4><Link to="/profile">Profile</Link><Link to="/addresses">Addresses</Link><Link to="/orders">Orders</Link></div>
        <div><h4>Platform</h4><span>React + Vite</span><span>API Gateway</span><span>Node microservices</span></div>
      </div>
      <div className="container footer-bottom">© 2026 MegaMart. DevOps portfolio application.</div>
    </footer>
  );
}
