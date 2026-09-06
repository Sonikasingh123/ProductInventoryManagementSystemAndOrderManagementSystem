import { useState } from 'react';

import AppLayout from './components/layout/AppLayout';

import ProductListPage from './features/products/ProductListPage';
import ProductDetailPage from './features/products/ProductDetailPage';

import StoreProductListPage from './features/orders/StoreProductListPage';
import StoreProductDetailPage from './features/orders/StoreProductDetailPage';
import OrderHistoryPage from './features/orders/OrderHistoryPage';
import OrderDetailPage from './features/orders/OrderDetailPage';

const USERS = [
  {
    id: 1,
    name: 'Alice Martin',
    email: 'alice@marketnode.com',
  },
  {
    id: 2,
    name: 'Bob Chen',
    email: 'bob@marketnode.com',
  },
  {
    id: 3,
    name: 'Carol Smith',
    email: 'carol@marketnode.com',
  },
];

type Page =
  | 'products'
  | 'product-detail'
  | 'store'
  | 'store-product-detail'
  | 'orders'
  | 'order-detail';

function App() {
  const [page, setPage] = useState<Page>('products');

  const [selectedProductId, setSelectedProductId] =
    useState<number | null>(null);

  const [selectedOrderId, setSelectedOrderId] =
    useState<number | null>(null);

  const [currentUser, setCurrentUser] =
    useState(USERS[0]);

  const navigate = (nextPage: string) => {
    if (
      nextPage === 'products' ||
      nextPage === 'store' ||
      nextPage === 'orders'
    ) {
      setPage(nextPage);

      setSelectedProductId(null);
      setSelectedOrderId(null);
    }
  };

  const content = (() => {
    switch (page) {
      // -------------------------
      // IMS
      // -------------------------

      case 'products':
        return (
          <ProductListPage
            onSelectProduct={(id: number) => {
              setSelectedProductId(id);
              setPage('product-detail');
            }}
          />
        );

      case 'product-detail':
        if (selectedProductId === null) {
          return null;
        }

        return (
          <ProductDetailPage
            id={selectedProductId}
            onBack={() => {
              setSelectedProductId(null);
              setPage('products');
            }}
          />
        );

      // -------------------------
      // OMS STORE
      // -------------------------

      case 'store':
        return (
          <StoreProductListPage
            onSelectProduct={(id: number) => {
              setSelectedProductId(id);
              setPage('store-product-detail');
            }}
          />
        );

      case 'store-product-detail':
        if (selectedProductId === null) {
          return null;
        }

        return (
          <StoreProductDetailPage
            id={selectedProductId}
            currentUser={currentUser}
            onBack={() => {
              setSelectedProductId(null);
              setPage('store');
            }}
            onOrderCreated={(orderId: number) => {
              setSelectedOrderId(orderId);
              setSelectedProductId(null);
              setPage('order-detail');
            }}
          />
        );

      // -------------------------
      // OMS ORDERS
      // -------------------------

      case 'orders':
        return (
          <OrderHistoryPage
            currentUser={currentUser}
            onSelectOrder={(id: number) => {
              setSelectedOrderId(id);
              setPage('order-detail');
            }}
          />
        );

      case 'order-detail':
        if (selectedOrderId === null) {
          return null;
        }

        return (
          <OrderDetailPage
            id={selectedOrderId}
            currentUser={currentUser}
            onBack={() => {
              setSelectedOrderId(null);
              setPage('orders');
            }}
          />
        );

      default:
        return null;
    }
  })();

  return (
    <AppLayout
      currentUser={currentUser}
      users={USERS}
      onUserChange={setCurrentUser}
      activePage={
        page === 'product-detail'
          ? 'products'
          : page === 'store-product-detail'
            ? 'store'
            : page === 'order-detail'
              ? 'orders'
              : page
      }
      onNavigate={navigate}
    >
      {content}
    </AppLayout>
  );
}

export default App;
