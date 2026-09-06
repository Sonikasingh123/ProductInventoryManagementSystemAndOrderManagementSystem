import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Chip } from '@heroui/react';
import AddProductModal from './AddProductModal';

export default function ProductListPage({ onSelectProduct }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [isAddOpen, setAddOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const loadProducts = () => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(data));
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button variant="primary" onPress={() => setAddOpen(true)}>
          + Add Product
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by product name"
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
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Products table">
            <Table.Header>
              <Table.Column isRowHeader>ID</Table.Column>
              <Table.Column>NAME</Table.Column>
              <Table.Column>CATEGORY</Table.Column>
              <Table.Column>DESCRIPTION</Table.Column>
              <Table.Column>PRICE</Table.Column>
              <Table.Column>STOCK</Table.Column>
            </Table.Header>
            <Table.Body>
              {filteredProducts.length === 0 ? (
                <Table.Row>
                  <Table.Cell>
                    No products found.
                  </Table.Cell>
                  <Table.Cell />
                  <Table.Cell />
                  <Table.Cell />
                  <Table.Cell />
                  <Table.Cell />
                </Table.Row>
              ) : (
                filteredProducts.map((p: any) => (
                  <Table.Row
                    key={p.id}
                    className="cursor-pointer"
                    onAction={() => onSelectProduct(p.id)}
                  >
                    <Table.Cell>{p.id}</Table.Cell>
                    <Table.Cell className="font-medium">{p.name}</Table.Cell>
                    <Table.Cell>{p.category || '—'}</Table.Cell>
                    <Table.Cell className="text-default-500">
                      {p.description || '—'}
                    </Table.Cell>
                    <Table.Cell>${Number(p.price).toFixed(2)}</Table.Cell>
                    <Table.Cell>
                      <Chip
                        size="sm"
                        color={p.stock > 0 ? 'success' : 'danger'}
                      >
                        <Chip.Label>{p.stock}</Chip.Label>
                      </Chip>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <AddProductModal
        isOpen={isAddOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          setAddOpen(false);
          loadProducts();
        }}
      />
    </div>
  );
}
