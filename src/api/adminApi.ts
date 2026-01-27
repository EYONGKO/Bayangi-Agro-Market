/** In dev, use '' so /api requests hit Vite proxy → backend. Set VITE_API_URL for production or no proxy. */
const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

export type ApiUser = { id: string; email: string; name: string };

export type ProductRecord = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  images?: string[];
  category?: string;
  community?: string;
  vendor?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  likes?: number;
};

export type OrderItemRecord = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export type OrderRecord = {
  _id: string;
  buyerName: string;
  buyerEmail: string;
  sellerId?: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItemRecord[];
  createdAt: string;
  updatedAt: string;
};

export type CommunityRecord = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryRecord = {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type PostRecord = {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
  content: string[];
  createdAt: string;
  updatedAt: string;
};

export type AdminUserRecord = {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'both';
  createdAt: string;
};

type AuthResponse = { token: string; user: ApiUser };

function resolveApiUrl(url: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });

  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const data = await res.json();
      msg = data?.error || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

export async function adminLogin(input: { email: string; password: string }) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input)
  });
}

export async function adminRegister(input: { name: string; email: string; password: string }) {
  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input)
  });
}

export async function listProducts(): Promise<ProductRecord[]> {
  return request<ProductRecord[]>('/api/products');
}

export async function createProduct(token: string, input: Omit<ProductRecord, '_id'>) {
  return request<ProductRecord>('/api/products', {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateProduct(token: string, id: string, input: Partial<Omit<ProductRecord, '_id'>>) {
  return request<ProductRecord>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deleteProduct(token: string, id: string) {
  return request<{ ok: true }>(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function listOrders(token: string): Promise<OrderRecord[]> {
  return request<OrderRecord[]>('/api/orders', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function createOrder(token: string, input: Omit<OrderRecord, '_id' | 'createdAt' | 'updatedAt'>) {
  return request<OrderRecord>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateOrder(token: string, id: string, input: Partial<Omit<OrderRecord, '_id' | 'createdAt' | 'updatedAt'>>) {
  return request<OrderRecord>(`/api/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deleteOrder(token: string, id: string) {
  return request<{ ok: true }>(`/api/orders/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function listUsers(token: string): Promise<AdminUserRecord[]> {
  return request<AdminUserRecord[]>('/api/users', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deleteUser(token: string, id: string) {
  return request<{ ok: true }>(`/api/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateUserRole(token: string, id: string, role: 'buyer' | 'seller' | 'both') {
  return request<AdminUserRecord>(`/api/users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function listCommunities(): Promise<CommunityRecord[]> {
  return request<CommunityRecord[]>('/api/communities');
}

export async function createCommunity(token: string, input: { name: string; description?: string; image?: string; slug?: string }) {
  return request<CommunityRecord>('/api/communities', {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateCommunity(token: string, id: string, input: { name?: string; description?: string; image?: string; slug?: string }) {
  return request<CommunityRecord>(`/api/communities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deleteCommunity(token: string, id: string) {
  return request<{ ok: true }>(`/api/communities/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function listCategories(): Promise<CategoryRecord[]> {
  return request<CategoryRecord[]>('/api/categories');
}

export async function createCategory(token: string, input: { name: string; slug?: string }) {
  return request<CategoryRecord>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateCategory(token: string, id: string, input: { name?: string; slug?: string }) {
  return request<CategoryRecord>(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deleteCategory(token: string, id: string) {
  return request<{ ok: true }>(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function listPosts(): Promise<PostRecord[]> {
  return request<PostRecord[]>('/api/posts');
}

export async function getPost(id: string): Promise<PostRecord> {
  return request<PostRecord>(`/api/posts/${id}`);
}

export async function createPost(token: string, input: Omit<PostRecord, '_id' | 'createdAt' | 'updatedAt'>) {
  return request<PostRecord>('/api/posts', {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updatePost(token: string, id: string, input: Partial<Omit<PostRecord, '_id' | 'createdAt' | 'updatedAt'>>) {
  return request<PostRecord>(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deletePost(token: string, id: string) {
  return request<{ ok: true }>(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function uploadImage(token: string, input: { dataUrl: string; filename?: string }) {
  const res = await request<{ url: string }>('/api/uploads/image', {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { Authorization: `Bearer ${token}` }
  });
  return { url: resolveApiUrl(res.url) };
}
