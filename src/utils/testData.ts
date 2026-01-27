import { addOrder } from '../data/ordersStore';

export function generateTestData() {
  const testOrders = [
    {
      id: 'TEST-ORD-001',
      buyerName: 'Alice Johnson',
      buyerEmail: 'alice@example.com',
      sellerId: 'local-artisan',
      total: 75000, // CFA
      status: 'delivered' as const,
      items: [
        { productId: 1, name: 'Traditional Basket', price: 45000, quantity: 1 },
        { productId: 2, name: 'Handmade Jewelry', price: 30000, quantity: 1 }
      ],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
    },
    {
      id: 'TEST-ORD-002', 
      buyerName: 'Bob Smith',
      buyerEmail: 'bob@example.com',
      sellerId: 'local-artisan',
      total: 54000, // CFA
      status: 'processing' as const,
      items: [
        { productId: 3, name: 'Wooden Carving', price: 54000, quantity: 1 }
      ],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
      id: 'TEST-ORD-003',
      buyerName: 'Carol Davis',
      buyerEmail: 'carol@example.com', 
      sellerId: 'local-artisan',
      total: 96000, // CFA
      status: 'shipped' as const,
      items: [
        { productId: 4, name: 'Ceramic Pottery Set', price: 96000, quantity: 1 }
      ],
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString() // 10 days ago
    }
  ];

  // Add test orders to local storage
  testOrders.forEach(order => {
    addOrder(order);
  });

  console.log('Test data generated successfully');
  return testOrders;
}
