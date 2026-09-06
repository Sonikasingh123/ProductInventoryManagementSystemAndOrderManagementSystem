import { useEffect, useState } from 'react';
import { Button, Card, Chip } from '@heroui/react';

import type { Order } from './types';

export default function OrderDetailPage({
  id,
  currentUser,
  onBack,
}: {
  id: number;
  currentUser: { id: number; name: string; email: string };
  onBack: () => void;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  const loadOrder = () => {
    setLoading(true);
    setError('');

    fetch(`/api/orders/${id}?userId=${currentUser.id}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Order not found.');
        }

        return response.json();
      })
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load order.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrder();
  }, [id, currentUser.id]);

  const handleCancel = async () => {
    if (!order || order.status !== 'CREATED') {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );

    if (!confirmed) {
      return;
    }

    setCancelling(true);
    setError('');

    try {
      const response = await fetch(
        `/api/orders/${id}/cancel?userId=${currentUser.id}`,
        {
          method: 'PATCH',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.error ||
          'Unable to cancel order.'
        );
      }

      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Unable to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <p className="text-default-500">Loading order...</p>;
  }

  if (!order) {
    return (
      <div>
        <Button variant="ghost" onPress={onBack} className="mb-4">
          ← Back to orders
        </Button>

        <Card>
          <Card.Content>
            <p className="text-danger">
              {error || 'Order not found.'}
            </p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  const formatDate = (value: string) => {
    return new Date(value).toLocaleString();
  };

  return (
    <div className="max-w-3xl">
      <Button variant="ghost" onPress={onBack} className="mb-4">
        ← Back to orders
      </Button>

      <Card>
        <Card.Header>
          <div className="flex justify-between items-start">
            <div>
              <Card.Title>
                Order #{order.id}
              </Card.Title>

              <p className="text-sm text-default-500 mt-1">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <Chip
              color={
                order.status === 'CREATED'
                  ? 'success'
                  : 'danger'
              }
            >
              <Chip.Label>{order.status}</Chip.Label>
            </Chip>
          </div>
        </Card.Header>

        <Card.Content>
          {error && (
            <div className="rounded-lg border border-danger-200 bg-danger-50 p-3 mb-5">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          <div className="rounded-lg border border-default-200 p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-lg font-semibold">
                  {order.productName}
                </p>

                <p className="text-sm text-default-500 mt-1">
                  Product #{order.productId}
                </p>
              </div>

              <p className="font-semibold">
                ${Number(order.totalAmount).toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-6">
              <div>
                <p className="text-sm text-default-500">
                  Quantity
                </p>
                <p className="font-medium">
                  {order.quantity}
                </p>
              </div>

              <div>
                <p className="text-sm text-default-500">
                  Unit Price
                </p>
                <p className="font-medium">
                  ${Number(order.unitPrice).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-default-500">
                  Total
                </p>
                <p className="font-medium">
                  ${Number(order.totalAmount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {order.status === 'CREATED' && (
            <div className="mt-6">
              <Button
                variant="danger"
                isDisabled={cancelling}
                onPress={handleCancel}
              >
                {cancelling
                  ? 'Cancelling...'
                  : 'Cancel Order'}
              </Button>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
