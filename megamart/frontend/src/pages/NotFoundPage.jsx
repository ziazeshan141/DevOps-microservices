import { Link } from 'react-router-dom';
export default function NotFoundPage(){return <div className="page container"><div className="empty-state"><div className="error-code">404</div><h1>Page not found</h1><p>The page you requested doesn’t exist in this storefront.</p><Link className="btn btn-primary" to="/">Back to MegaMart</Link></div></div>}
