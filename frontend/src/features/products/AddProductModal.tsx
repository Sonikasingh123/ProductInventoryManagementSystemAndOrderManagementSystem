import { useState } from 'react';
import { Modal, Button, TextField, Input, Label } from '@heroui/react';

export default function AddProductModal({ isOpen, onClose, onCreated }: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, category, price: Number(price), stock: 0 }),
    }).then(() => {
      setName('');
      setDescription('');
      setCategory('');
      setPrice('');
      onCreated();
    });
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Add Product</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <TextField isRequired>
                  <Label>Name</Label>
                  <Input value={name} onChange={(e: any) => setName(e.target.value)} />
                </TextField>
                <div className="flex flex-col gap-1">
                  <Label>Category</Label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">Select category</option>
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="CLOTHING">Clothing</option>
                    <option value="HOME_GARDEN">Home & Garden</option>
                    <option value="SPORTS">Sports</option>
                    <option value="BOOKS">Books</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <TextField>
                  <Label>Description</Label>
                  <Input value={description} onChange={(e: any) => setDescription(e.target.value)} />
                </TextField>
                <TextField isRequired>
                  <Label>Price</Label>
                  <Input type="number" value={price} onChange={(e: any) => setPrice(e.target.value)} />
                </TextField>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onPress={onClose}>Cancel</Button>
              <Button variant="primary" onPress={handleSubmit}>Save</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
