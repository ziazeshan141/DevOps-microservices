import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { commerceApi } from '../api/commerce';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshCartCount = () => {
      if (!user) { setCartCount(0); return; }
      commerceApi.cart().then((cart) => setCartCount(cart.items?.reduce((n, x) => n + Number(x.quantity || 0), 0) || 0)).catch(() => {});
    };
    refreshCartCount();
    window.addEventListener('megamart:cart-changed', refreshCartCount);
    return () => window.removeEventListener('megamart:cart-changed', refreshCartCount);
  }, [user]);

  const search = (event) => {
    event.preventDefault();
    navigate(`/products${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  return (
    <>
      <div className="announcement">Free local delivery on orders over $50 <span>•</span> Phase 1 microservices storefront</div>
      <header className="site-header">
        <div className="header-main container">
          <Link className="brand" to="/"><span className="brand-mark">M</span><span>MegaMart</span></Link>
          <form className="search-bar" onSubmit={search}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands and categories" aria-label="Search products" />
            <button type="submit">Search</button>
          </form>
          <div className="header-actions">
            {user ? (
              <div className="account-menu">
                <Link to="/profile"><span className="action-icon">◉</span><span><small>Hello</small>{user.email?.split('@')[0]}</span></Link>
                <button className="link-button" onClick={logout}>Sign out</button>
              </div>
            ) : (
              <Link to="/login"><span className="action-icon">◉</span><span><small>Hello, sign in</small>Account</span></Link>
            )}
            <Link to="/orders"><span className="action-icon">▣</span><span><small>Track</small>Orders</span></Link>
            <Link className="cart-link" to="/cart"><span className="action-icon">🛒</span><span><small>{cartCount} items</small>Cart</span></Link>
          </div>
        </div>
        <nav className="category-nav">
          <div className="container nav-row">
            <NavLink to="/products">All Categories</NavLink>
            <NavLink to="/products?q=electronics">Electronics</NavLink>
            <NavLink to="/products?q=home">Home & Kitchen</NavLink>
            <NavLink to="/products?q=beauty">Beauty</NavLink>
            <NavLink to="/products?q=sports">Sports</NavLink>
            <NavLink to="/wishlist">Wishlist</NavLink>
            {isAdmin && <NavLink to="/admin">Admin</NavLink>}
            <NavLink className="deal-link" to="/products">Today’s Deals</NavLink>
          </div>
        </nav>
      </header>
    </>
  );
}
