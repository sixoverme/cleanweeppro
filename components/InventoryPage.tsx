
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { InventoryItem } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from './Icons';

// Modal Component
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
                    </div>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};


// InventoryForm Component
interface InventoryFormProps {
    item?: InventoryItem | null;
    onSave: (item: Omit<InventoryItem, 'id'> | InventoryItem) => void;
    onClose: () => void;
}
const InventoryForm: React.FC<InventoryFormProps> = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        quantity: item?.quantity ?? '',
        lowStockThreshold: item?.lowStockThreshold ?? '',
        purchaseLocation: item?.purchaseLocation || '',
        cost: item?.cost ?? '',
        notes: item?.notes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            quantity: parseInt(String(formData.quantity)) || 0,
            lowStockThreshold: parseInt(String(formData.lowStockThreshold)) || 0,
            cost: parseFloat(String(formData.cost)) || undefined,
        };
        onSave(item ? { ...item, ...finalData } : finalData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block font-semibold text-slate-700 mb-1">Low Stock At</label>
                    <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-semibold text-slate-700 mb-1">Item Cost</label>
                    <input type="number" step="0.01" name="cost" value={formData.cost} onChange={handleChange} placeholder="e.g., 12.50" className="w-full p-2 border rounded" />
                </div>
                 <div>
                    <label className="block font-semibold text-slate-700 mb-1">Where Purchased</label>
                    <input name="purchaseLocation" value={formData.purchaseLocation} onChange={handleChange} placeholder="e.g., Amazon" className="w-full p-2 border rounded" />
                </div>
            </div>
            <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full p-2 border rounded" rows={3}></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Save Item</button>
            </div>
        </form>
    );
};


const InventoryPage: React.FC = () => {
    const { inventory, updateInventoryItem, addInventoryItem, deleteInventoryItem } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const navigate = useNavigate();

    const handleQuantityChange = (e: React.MouseEvent, item: InventoryItem, delta: number) => {
        e.stopPropagation();
        const newQuantity = Math.max(0, item.quantity + delta);
        updateInventoryItem({ ...item, quantity: newQuantity });
    };

    const handleAddClick = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (e: React.MouseEvent, item: InventoryItem) => {
        e.stopPropagation();
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (e: React.MouseEvent, itemId: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteInventoryItem(itemId);
        }
    };
    
    const handleSave = (itemData: Omit<InventoryItem, 'id'> | InventoryItem) => {
        if ('id' in itemData) {
            updateInventoryItem(itemData);
        } else {
            addInventoryItem(itemData as Omit<InventoryItem, 'id'>);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
                 <h3 className="text-lg font-bold mb-4">Current Inventory</h3>
                <ul className="space-y-2">
                    {inventory.map(item => {
                        const isLowStock = item.quantity <= item.lowStockThreshold;
                        return (
                            <li key={item.id} onClick={() => navigate(`/inventory/${item.id}`)} className={`p-3 rounded-md flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow ${isLowStock ? 'bg-red-50 border-l-4 border-red-400' : 'bg-slate-50'}`}>
                                <div>
                                    <p className="font-semibold text-slate-800">{item.name}</p>
                                    {isLowStock && <p className="text-xs text-red-600 font-semibold">Low Stock!</p>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={(e) => handleQuantityChange(e, item, -1)} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300">-</button>
                                    <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                                    <button onClick={(e) => handleQuantityChange(e, item, 1)} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300">+</button>
                                    <button onClick={(e) => handleEditClick(e, item)} className="p-2 text-slate-500 hover:text-brand-primary"><PencilIcon className="w-5 h-5" /></button>
                                    <button onClick={(e) => handleDeleteClick(e, item.id)} className="p-2 text-slate-500 hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            
            <button onClick={handleAddClick} className="fixed bottom-24 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-brand-dark transition-transform hover:scale-110">
                <PlusIcon className="w-6 h-6" />
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Item' : 'Add New Item'}>
                <InventoryForm
                    item={editingItem}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default InventoryPage;