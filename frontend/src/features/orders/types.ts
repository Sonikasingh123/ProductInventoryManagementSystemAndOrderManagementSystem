export type StoreProduct = {
  id: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  inStock: boolean;
};

export type OrderStatus = 'CREATED' | 'CANCELLED';

export type Order = {
  id: number;
  status: OrderStatus;
  userId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  createdAt: string;
};
