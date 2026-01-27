import type { Order } from '../data/ordersStore';

export function calculateTrend(currentValue: number, previousValue: number): string {
  if (previousValue === 0) {
    return currentValue > 0 ? '+100%' : '0%';
  }
  
  const change = ((currentValue - previousValue) / previousValue) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${Math.round(change)}%`;
}

export function getPreviousMonthData(orders: Order[]): Order[] {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= lastMonth && orderDate < thisMonth;
  });
}

export function getCurrentMonthData(orders: Order[]): Order[] {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= thisMonth;
  });
}

export function calculateAnalytics(orders: Order[]) {
  const currentMonthOrders = getCurrentMonthData(orders);
  const previousMonthOrders = getPreviousMonthData(orders);
  
  const currentEarnings = currentMonthOrders.reduce((sum, o) => sum + o.total, 0);
  const previousEarnings = previousMonthOrders.reduce((sum, o) => sum + o.total, 0);
  
  const currentOrdersCount = currentMonthOrders.length;
  const previousOrdersCount = previousMonthOrders.length;
  
  const earningsTrend = calculateTrend(currentEarnings, previousEarnings);
  const ordersTrend = calculateTrend(currentOrdersCount, previousOrdersCount);
  
  const totalEarnings = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSold = orders.reduce((sum, o) => 
    sum + o.items.reduce((s, i) => s + i.quantity, 0), 0
  );
  
  return {
    earnings: totalEarnings,
    totalSold,
    ordersCount: orders.length,
    earningsTrend,
    ordersTrend,
    revenueTrend: earningsTrend !== '0%' ? `${earningsTrend} from last month` : 'No previous data',
    avgOrderValue: orders.length > 0 ? Math.round(totalEarnings / orders.length) : 0
  };
}
