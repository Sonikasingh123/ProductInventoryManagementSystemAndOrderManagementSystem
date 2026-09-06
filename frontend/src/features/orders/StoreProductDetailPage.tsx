import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Chip,
  Input,
  Label,
  TextField,
} from '@heroui/react';

import type { StoreProduct, Order } from './types';

export default function StoreProductDetailPage({
  id,
  currentUser,
  onBack,
  onOrderCreated,
}: {
  id: number;
  currentUser: { id: number; name: string; email: string };
  onBack: () => void;
  onOrderCreated: (orderId: number) => void;
}) {
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(`/api/store/products/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Product not found.');
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load product.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handlePlaceOrder = async () => {
    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1 ||
      parsedQuantity > 999
    ) {
      setError('Quantity must be a whole number between 1 and 999.');
      return;
    }

    if (!product?.inStock) {
      setError('This product is currently out of stock.');
      return;
    }

    setOrdering(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          productId: product.id,
          quantity: parsedQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.error ||
          'Unable to place order.'
        );
      }

      const order: Order = data;

      onOrderCreated(order.id);
    } catch (err: any) {
      setError(err.message || 'Unable to place order.');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return <p className="text-default-500">Loading product...</p>;
  }

  if (error && !product) {
    return (
      <div>
        <Button variant="ghost" onPress={onBack} className="mb-4">
          ← Back to store
        </Button>

        <Card>
          <Card.Content>
            <p className="text-danger">{error}</p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const total =
    Number(product.price) * Math.max(1, Number(quantity) || 1);

  return (
    <div className="max-w-3xl">
      <Button variant="ghost" onPress={onBack} className="mb-4">
        ← Back to store
      </Button>

      <Card>
        <Card.Header>
          <div className="flex justify-between items-start gap-4">
            <div>
              <Card.Title className="text-2xl">
                {product.name}
              </Card.Title>

              <p className="text-default-500 mt-1">
                {product.category}
              </p>
            </div>

            <Chip
              color={product.inStock ? 'success' : 'danger'}
            >
              <Chip.Label>
                {product.inStock ? 'In stock' : 'Out of stock'}
              </Chip.Label>
            </Chip>
          </div>
        </Card.Header>

        <Card.Content>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-default-500 mb-2">
                Description
              </p>

              <p className="leading-7">
                {product.description || 'No description available.'}
              </p>
            </div>

            <div>
              <p className="text-sm text-default-500">
                Unit price
              </p>

              <p className="text-2xl font-semibold">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-danger-200 bg-danger-50 p-3">
                <p className="text-danger text-sm">{error}</p>
              </div>
            )}

            <div className="border-t border-default-200 pt-6">
              <div className="flex flex-col sm:flex-row gap-5 items-end">
                <TextField className="w-full sm:w-40">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    max="999"
                    value={quantity}
                    onChange={(e: any) =>
                      setQuantity(e.target.value)
                    }
                  />
                </TextField>

                <div className="flex-1">
                  <p className="text-sm text-default-500">
                    Order total
                  </p>
                  <p className="text-xl font-semibold">
                    ${total.toFixed(2)}
                  </p>
                </div>

                <Button
                  variant="primary"
                  isDisabled={!product.inStock || ordering}
                  onPress={handlePlaceOrder}
                >
                  {ordering ? 'Placing order...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
