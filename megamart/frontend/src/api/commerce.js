import { post, put, remove, request } from './client';

export const authApi = {
  register: (data) => post('/api/v1/auth/register', data),
  login: (data) => post('/api/v1/auth/login', data),
  me: () => request('/api/v1/auth/me'),
  logout: (refreshToken) => post('/api/v1/auth/logout', { refreshToken }),
};

export const commerceApi = {
  products: (limit = 50) => request(`/api/v1/products?limit=${limit}`),
  product: (id) => request(`/api/v1/products/${id}`),
  categories: () => request('/api/v1/catalog/categories'),
  price: (id) => request(`/api/v1/pricing/${id}`),
  media: (id) => request(`/api/v1/media/product/${id}`),
  rating: (id) => request(`/api/v1/ratings/${id}`),
  reviews: (id) => request(`/api/v1/reviews/product/${id}`),
  addReview: (data) => post('/api/v1/reviews', data),
  rate: (id, rating) => put(`/api/v1/ratings/${id}`, { rating }),
  search: (q) => request(`/api/v1/search?q=${encodeURIComponent(q)}`),
  recommendations: (limit = 8) => request(`/api/v1/recommendations?limit=${limit}`),
  inventory: (id) => request(`/api/v1/inventory/${id}`),

  cart: () => request('/api/v1/cart'),
  addCart: async (productId, quantity = 1) => { const x = await post('/api/v1/cart/items', { productId, quantity }); window.dispatchEvent(new Event('megamart:cart-changed')); return x; },
  setCart: async (productId, quantity) => { const x = await put(`/api/v1/cart/items/${productId}`, { quantity }); window.dispatchEvent(new Event('megamart:cart-changed')); return x; },
  removeCart: async (productId) => { const x = await remove(`/api/v1/cart/items/${productId}`); window.dispatchEvent(new Event('megamart:cart-changed')); return x; },
  clearCart: async () => { const x = await remove('/api/v1/cart'); window.dispatchEvent(new Event('megamart:cart-changed')); return x; },

  wishlist: () => request('/api/v1/wishlist'),
  addWishlist: (id) => post(`/api/v1/wishlist/${id}`, {}),
  removeWishlist: (id) => remove(`/api/v1/wishlist/${id}`),

  addresses: () => request('/api/v1/addresses'),
  address: (id) => request(`/api/v1/addresses/${id}`),
  addAddress: (data) => post('/api/v1/addresses', data),
  removeAddress: (id) => remove(`/api/v1/addresses/${id}`),

  checkout: (data) => post('/api/v1/checkout', data),
  orders: () => request('/api/v1/orders'),
  order: (id) => request(`/api/v1/orders/${id}`),
  cancelOrder: (id) => post(`/api/v1/orders/${id}/cancel`, {}),
  shipping: (orderId) => request(`/api/v1/shipping/${orderId}`),

  profile: (id) => request(`/api/v1/users/${id}/profile`),
  updateProfile: (id, data) => put(`/api/v1/users/${id}`, data),
  adminSummary: () => request('/api/v1/admin/summary'),
};

export async function getProductBundle(id) {
  const product = await commerceApi.product(id);
  const [price, media, rating, inventory] = await Promise.all([
    commerceApi.price(id).catch(() => null),
    commerceApi.media(id).catch(() => []),
    commerceApi.rating(id).catch(() => ({ average: 0, count: 0 })),
    commerceApi.inventory(id).catch(() => null),
  ]);
  return { product, price, media, rating, inventory };
}

export async function hydrateProducts(products = []) {
  return Promise.all(products.map(async (product) => {
    const [price, media, rating] = await Promise.all([
      commerceApi.price(product.id).catch(() => null),
      commerceApi.media(product.id).catch(() => []),
      commerceApi.rating(product.id).catch(() => ({ average: 0, count: 0 })),
    ]);
    return { product, price, media, rating };
  }));
}
