import { useEffect, useState } from 'react';
import { Button, Card, Chip, Table } from '@heroui/react';

import type { Order } from './types';

export default function OrderHistoryPage({
  currentUser,
  onSelectOrder,
}: {
  currentUser: { id: number; name: string; email: string };
  onSelectOrder: (id: number) => void;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = () => {
    setLoading(true);
    setError('');

    fetch(`/api/orders?userId=${currentUser.id}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load orders.');
        }

        return response.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load orders.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, [currentUser.id]);

  const formatDate = (value: string) => {
    return new Date(value).toLocaleString();
  };

  if (loading) {
    return <p className="text-default-500">Loading orders...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Order History</h1>
        <p className="text-default-500 mt-1">
          Your previous orders.
        </p>
      </div>

      {error && (
        <Card className="mb-4">
          <Card.Content>
            <p className="text-danger">{error}</p>
            <Button
              size="sm"
              className="mt-3"
              onPress={loadOrders}
            >
              Retry
            </Button>
          </Card.Content>
        </Card>
      )}

      {!error && orders.length === 0 && (
        <Card>
          <Card.Content className="py-12 text-center">
            <p className="text-default-500">
              You haven't placed any orders yet.
            </p>
          </Card.Content>
        </Card>
      )}

      {!error && orders.length > 0 && (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Order history">
              <Table.Header>
                <Table.Column isRowHeader>ORDER</Table.Column>
                <Table.Column>PRODUCT</Table.Column>
                <Table.Column>QUANTITY</Table.Column>
                <Table.Column>TOTAL</Table.Column>
                <Table.Column>STATUS</Table.Column>
                <Table.Column>DATE</Table.Column>
              </Table.Header>

              <Table.Body>
                {orders.map((order) => (
                  <Table.Row
                    key={order.id}
                    className="cursor-pointer"
                    onAction={() => onSelectOrder(order.id)}
                  >
                    <Table.Cell>
                      <span className="font-medium">
                        #{order.id}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      {order.productName}
                    </Table.Cell>

                    <Table.Cell>
                      {order.quantity}
                    </Table.Cell>

                    <Table.Cell>
                      ${Number(order.totalAmount).toFixed(2)}
                    </Table.Cell>

                    <Table.Cell>
                      <Chip
                        size="sm"
                        color={
                          order.status === 'CREATED'
                            ? 'success'
                            : 'danger'
                        }
                      >
                        <Chip.Label>
                          {order.status}
                        </Chip.Label>
                      </Chip>
                    </Table.Cell>

                    <Table.Cell>
                      {formatDate(order.createdAt)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
    </div>
  );
}
