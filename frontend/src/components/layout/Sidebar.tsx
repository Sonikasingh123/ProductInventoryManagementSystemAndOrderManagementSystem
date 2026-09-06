const inventoryItems = [
  { id: 'products', label: 'Products' },
  { id: 'suppliers', label: 'Suppliers', disabled: true },
  { id: 'warehouses', label: 'Warehouses', disabled: true },
  { id: 'billing', label: 'Billing', disabled: true },
  { id: 'reports', label: 'Reports', disabled: true },
];

const orderItems = [
  { id: 'store', label: 'Store' },
  { id: 'orders', label: 'Orders' },
];

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (page: string) => void;
}) {
  return (
    <aside className="w-56 border-r border-default-200 bg-default-50 min-h-0 shrink-0">
      <div className="p-3">

        <p className="text-xs font-semibold text-default-400 uppercase tracking-wider px-2 mb-2">
          Inventory Management
        </p>

        <div className="flex flex-col gap-1">
          {inventoryItems.map((item) => (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active === item.id
                  ? 'bg-default-200 font-medium'
                  : 'hover:bg-default-100'
                } ${item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-default-400 uppercase tracking-wider px-2 mb-2 mt-6">
          Order Management
        </p>

        <div className="flex flex-col gap-1">
          {orderItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active === item.id
                  ? 'bg-default-200 font-medium'
                  : 'hover:bg-default-100'
                } cursor-pointer`}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>
    </aside>
  );
}