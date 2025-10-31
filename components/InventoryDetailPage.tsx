
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon } from './Icons';

const DetailSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const DetailRow: React.FC<{label: string, value?: string | number}> = ({label, value}) => (
    <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-slate-800">{value ?? 'N/A'}</p>
    </div>
);

const InventoryDetailPage: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const { inventory } = useAppContext();
    const navigate = useNavigate();

    const item = inventory.find(i => i.id === itemId);

    if (!item) {
        return (
            <div className="text-center">
                <p>Inventory item not found.</p>
                <button onClick={() => navigate('/inventory')} className="mt-4 px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-dark">
                    Back to Inventory
                </button>
            </div>
        );
    }

    const isLowStock = item.quantity <= item.lowStockThreshold;

    return (
        <div className="space-y-6">
             <div className="flex items-center mb-2">
                <button onClick={() => navigate('/inventory')} className="p-2 rounded-full hover:bg-slate-200" aria-label="Back to Inventory">
                    <ChevronLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <div className="ml-2">
                     <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{item.name}</h2>
                     {isLowStock && <p className="text-red-600 font-semibold">Low Stock!</p>}
                </div>
            </div>

            <DetailSection title="Item Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow label="Current Quantity" value={item.quantity} />
                    <DetailRow label="Low Stock Threshold" value={item.lowStockThreshold} />
                    <DetailRow label="Item Cost" value={item.cost ? `$${item.cost.toFixed(2)}` : 'N/A'} />
                    <DetailRow label="Purchase Location" value={item.purchaseLocation} />
                </div>
            </DetailSection>

            {item.notes && (
                <DetailSection title="Notes">
                    <p className="text-slate-600 whitespace-pre-wrap">{item.notes}</p>
                </DetailSection>
            )}
        </div>
    );
};

export default InventoryDetailPage;