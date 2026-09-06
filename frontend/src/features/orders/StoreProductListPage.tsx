import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Chip } from '@heroui/react';
import type { StoreProduct } from './types';

export default function StoreProductListPage({
  onSelectProduct,
}: {
  onSelectProduct: (id: number) => void;
}) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const loadProducts = () => {
    setLoading(true);
    setError('');

    fetch('/api/store/products')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to load products');
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load products');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === 'ALL' ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  if (loading) {
    return <p className="text-default-500">Loading products...</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-danger-200 bg-danger-50 p-4">
        <p className="text-danger">{error}</p>
        <Button className="mt-3" size="sm" onPress={loadProducts}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Store</h1>
        <p className="text-default-500 mt-1">
          Browse products available for purchase.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 rounded-lg border px-4 py-2"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full md:w-64 rounded-lg border px-4 py-2"
        >
          <option value="ALL">All Categories</option>
          <option value="ELECTRONICS">Electronics</option>
          <option value="CLOTHING">Clothing</option>
          <option value="HOME_GARDEN">Home & Garden</option>
          <option value="SPORTS">Sports</option>
          <option value="BOOKS">Books</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      {products.length === 0 ? (
        <Card>
          <Card.Content className="py-12 text-center">
            <p className="text-default-500">
              No products available.
            </p>
          </Card.Content>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <Card.Content className="py-12 text-center">
            <p className="text-default-500">
              No products match your filters.
            </p>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectProduct(product.id)}
            >
              <Card.Header>
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <Card.Title>{product.name}</Card.Title>
                    <p className="text-sm text-default-500 mt-1">
                      {product.category}
                    </p>
                  </div>

                  <Chip
                    size="sm"
                    color={product.inStock ? 'success' : 'danger'}
                  >
                    <Chip.Label>
                      {product.inStock ? 'In stock' : 'Out of stock'}
                    </Chip.Label>
                  </Chip>
                </div>
              </Card.Header>

              <Card.Content>
                <p className="text-sm text-default-500 line-clamp-3 min-h-16">
                  {product.description || 'No description available.'}
                </p>

                <div className="flex justify-between items-center mt-5">
                  <span className="text-lg font-semibold">
                    ${Number(product.price).toFixed(2)}
                  </span>

                  <Button
                    size="sm"
                    variant="primary"
                    onPress={() => onSelectProduct(product.id)}
                  >
                    View
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
