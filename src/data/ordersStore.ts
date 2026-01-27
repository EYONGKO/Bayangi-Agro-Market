export type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
};

const ORDERS_KEY = 'local-roots-orders-v1';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function load(): Order[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(orders: Order[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getAllOrders(): Order[] {
  return load();
}

export function getOrdersBySeller(sellerId: string): Order[] {
  return load().filter((o) => o.sellerId === sellerId);
}

export function addOrder(order: Order) {
  const next = [order, ...load()];
  save(next);
}

export function updateOrder(orderId: string, patch: Partial<Omit<Order, 'id'>>): Order {
  const all = load();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx < 0) {
    throw new Error('Order not found');
  }
  const updated: Order = { ...all[idx], ...patch, id: all[idx].id };
  const next = [...all];
  next[idx] = updated;
  save(next);
  return updated;
}

export function deleteOrder(orderId: string) {
  const next = load().filter((o) => o.id !== orderId);
  save(next);
}

