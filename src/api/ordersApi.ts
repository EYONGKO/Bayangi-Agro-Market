import type { Order } from '../data/ordersStore';

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

const ORDERS_CHANGED_EVENT = 'local-roots-orders-changed';

export function notifyOrdersChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(ORDERS_CHANGED_EVENT));
}

export function subscribeOrdersChanged(handler: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(ORDERS_CHANGED_EVENT, handler);
  return () => window.removeEventListener(ORDERS_CHANGED_EVENT, handler);
}

type OrderRecord = {
  _id: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  createdAt: string;
  updatedAt: string;
};

function mapOrder(r: OrderRecord): Order {
  return {
    id: r._id,
    buyerName: r.buyerName,
    buyerEmail: r.buyerEmail,
    sellerId: r.sellerId,
    total: r.total,
    status: r.status,
    items: r.items,
    createdAt: r.createdAt
  };
}

export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/api/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = (await res.json()) as OrderRecord[];
    return data.map(mapOrder);
  } catch (error) {
    console.warn('Failed to fetch orders from API, falling back to local storage');
    // Fallback to local storage if API fails
    const { getAllOrders } = await import('../data/ordersStore');
    return getAllOrders();
  }
}

export async function fetchOrdersBySeller(sellerId: string): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/api/orders/seller/${sellerId}`);
    if (!res.ok) throw new Error('Failed to fetch seller orders');
    const data = (await res.json()) as OrderRecord[];
    return data.map(mapOrder);
  } catch (error) {
    console.warn('Failed to fetch seller orders from API, falling back to local storage');
    // Fallback to local storage if API fails
    const { getOrdersBySeller } = await import('../data/ordersStore');
    return getOrdersBySeller(sellerId);
  }
}

export async function createOrder(orderData: Omit<OrderRecord, '_id' | 'createdAt'>): Promise<Order> {
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderData,
        createdAt: new Date().toISOString()
      }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create order');
    }
    
    const data = (await res.json()) as OrderRecord;
    notifyOrdersChanged();
    return mapOrder(data);
  } catch (error) {
    console.warn('Failed to create order via API, falling back to local storage');
    // Fallback to local storage if API fails
    const { addOrder } = await import('../data/ordersStore');
    const order: Order = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString()
    };
    addOrder(order);
    notifyOrdersChanged();
    return order;
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  try {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update order');
    }
    
    const data = (await res.json()) as OrderRecord;
    notifyOrdersChanged();
    return mapOrder(data);
  } catch (error) {
    console.warn('Failed to update order via API, falling back to local storage');
    // Fallback to local storage if API fails
    const { updateOrder } = await import('../data/ordersStore');
    const updated = updateOrder(orderId, { status });
    notifyOrdersChanged();
    return updated;
  }
}
