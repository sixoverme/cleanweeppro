
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import { Customer, Contact, Location, Pet, Kid } from '../types.ts';
import { PlusIcon, PencilIcon, TrashIcon, MapPinIcon, PhoneIcon } from './Icons.tsx';

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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
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

// CustomerForm Component
interface CustomerFormProps {
    customer?: Customer | null;
    onSave: (customer: Omit<Customer, 'id'> | Customer) => void;
    onClose: () => void;
}
const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onClose }) => {
    const [formData, setFormData] = useState({ householdName: '', cleaningFrequency: '', houseNotes: '' });
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [kids, setKids] = useState<Kid[]>([]);

    useEffect(() => {
        if (customer) {
            setFormData({ householdName: customer.householdName, cleaningFrequency: customer.cleaningFrequency, houseNotes: customer.houseNotes });
            setContacts(customer.contacts);
            setLocations(customer.locations);
            setPets(customer.pets);
            setKids(customer.kids);
        } else {
            setFormData({ householdName: '', cleaningFrequency: '', houseNotes: '' });
            setContacts([{ id: crypto.randomUUID(), name: '', relationship: '', phone: '', email: '', isPrimary: true }]);
            setLocations([{ id: crypto.randomUUID(), address: '', label: '', isPrimary: true }]);
            setPets([]);
            setKids([]);
        }
    }, [customer]);

    const handleArrayItemChange = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, field: keyof T, value: any) => {
        setter(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };
    
    const addArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, newItem: T) => {
        setter(prev => [...prev, newItem]);
    };
    
    const removeArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const setPrimary = <T extends {isPrimary: boolean}>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
        setter(prev => prev.map((item, i) => ({...item, isPrimary: i === index})));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCustomerData = { ...formData, contacts, locations, pets, kids };
        onSave(customer ? { ...customer, ...finalCustomerData } : finalCustomerData);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block font-bold text-slate-700 mb-1">Household Name</label>
                <input name="householdName" value={formData.householdName} onChange={e => setFormData({...formData, householdName: e.target.value})} placeholder="e.g., The Smith Family" className="w-full p-2 border rounded" required />
            </div>
            
            {/* Contacts Section */}
            <div className="space-y-2">
                <h3 className="font-bold text-slate-700">Contacts</h3>
                {contacts.map((contact, index) => (
                    <div key={contact.id} className="bg-slate-50 p-3 rounded-md space-y-2">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="radio" name="primaryContact" checked={contact.isPrimary} onChange={() => setPrimary(setContacts, index)} className="mr-2"/>
                                <label className="text-sm font-semibold">Primary Contact</label>
                            </div>
                            {contacts.length > 1 && <button type="button" onClick={() => removeArrayItem(setContacts, index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4" /></button>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input value={contact.name} onChange={e => handleArrayItemChange(setContacts, index, 'name', e.target.value)} placeholder="Name" className="w-full p-2 border rounded" required/>
                            <input value={contact.relationship} onChange={e => handleArrayItemChange(setContacts, index, 'relationship', e.target.value)} placeholder="Relationship" className="w-full p-2 border rounded"/>
                            <input value={contact.phone} onChange={e => handleArrayItemChange(setContacts, index, 'phone', e.target.value)} placeholder="Phone" className="w-full p-2 border rounded"/>
                            <input type="email" value={contact.email} onChange={e => handleArrayItemChange(setContacts, index, 'email', e.target.value)} placeholder="Email" className="w-full p-2 border rounded"/>
                        </div>
                    </div>
                ))}
                 <button type="button" onClick={() => addArrayItem(setContacts, {id: crypto.randomUUID(), name:'', relationship:'', phone:'', email:'', isPrimary: contacts.length === 0})} className="text-sm px-3 py-1 bg-slate-200 rounded hover:bg-slate-300">Add Contact</button>
            </div>

             {/* Locations Section */}
             <div className="space-y-2">
                <h3 className="font-bold text-slate-700">Locations</h3>
                {locations.map((loc, index) => (
                     <div key={loc.id} className="bg-slate-50 p-3 rounded-md space-y-2">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center">
                                <input type="radio" name="primaryLocation" checked={loc.isPrimary} onChange={() => setPrimary(setLocations, index)} className="mr-2"/>
                                <label className="text-sm font-semibold">Primary Location</label>
                            </div>
                            {locations.length > 1 && <button type="button" onClick={() => removeArrayItem(setLocations, index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4" /></button>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input value={loc.label} onChange={e => handleArrayItemChange(setLocations, index, 'label', e.target.value)} placeholder="Label (e.g. Home)" className="w-full p-2 border rounded" required/>
                            <input value={loc.address} onChange={e => handleArrayItemChange(setLocations, index, 'address', e.target.value)} placeholder="Full Address" className="w-full p-2 border rounded sm:col-span-2" required/>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem(setLocations, {id: crypto.randomUUID(), label:'', address:'', isPrimary: locations.length === 0})} className="text-sm px-3 py-1 bg-slate-200 rounded hover:bg-slate-300">Add Location</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {/* Pets Section */}
                <div className="space-y-2">
                    <h3 className="font-bold text-slate-700">Pets</h3>
                    {pets.map((pet, index) => (
                        <div key={pet.id} className="flex items-center gap-2">
                            <input value={pet.type} onChange={e => handleArrayItemChange(setPets, index, 'type', e.target.value)} placeholder="Type (e.g. Dog)" className="w-full p-2 border rounded"/>
                            <input value={pet.notes} onChange={e => handleArrayItemChange(setPets, index, 'notes', e.target.value)} placeholder="Notes" className="w-full p-2 border rounded"/>
                            <button type="button" onClick={() => removeArrayItem(setPets, index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem(setPets, {id: crypto.randomUUID(), type:'', notes:''})} className="text-sm px-3 py-1 bg-slate-200 rounded hover:bg-slate-300">Add Pet</button>
                </div>
                
                 {/* Kids Section */}
                <div className="space-y-2">
                    <h3 className="font-bold text-slate-700">Kids</h3>
                    {kids.map((kid, index) => (
                        <div key={kid.id} className="flex items-center gap-2">
                            <input value={kid.name} onChange={e => handleArrayItemChange(setKids, index, 'name', e.target.value)} placeholder="Name" className="w-full p-2 border rounded"/>
                            <input value={kid.notes} onChange={e => handleArrayItemChange(setKids, index, 'notes', e.target.value)} placeholder="Notes" className="w-full p-2 border rounded"/>
                            <button type="button" onClick={() => removeArrayItem(setKids, index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem(setKids, {id: crypto.randomUUID(), name:'', notes:''})} className="text-sm px-3 py-1 bg-slate-200 rounded hover:bg-slate-300">Add Kid</button>
                </div>
            </div>

            <div>
                 <label className="block font-bold text-slate-700 mb-1">House Notes</label>
                 <textarea name="houseNotes" value={formData.houseNotes} onChange={e => setFormData({...formData, houseNotes: e.target.value})} placeholder="e.g. Key under the mat" className="w-full p-2 border rounded" rows={3}></textarea>
            </div>
             <div>
                 <label className="block font-bold text-slate-700 mb-1">Cleaning Frequency</label>
                 <input name="cleaningFrequency" value={formData.cleaningFrequency} onChange={e => setFormData({...formData, cleaningFrequency: e.target.value})} placeholder="e.g., Weekly" className="w-full p-2 border rounded" />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Save Customer</button>
            </div>
        </form>
    );
};

const CustomersPage: React.FC = () => {
    const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const navigate = useNavigate();

    const handleAddClick = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (e: React.MouseEvent, customer: Customer) => {
        e.stopPropagation(); // prevent navigation
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };
    
    const handleDeleteClick = (e: React.MouseEvent, customerId: string) => {
        e.stopPropagation(); // prevent navigation
        if (window.confirm('Are you sure you want to delete this customer?')) {
            deleteCustomer(customerId);
        }
    };

    const handleSave = (customerData: Omit<Customer, 'id'> | Customer) => {
        if ('id' in customerData) {
            updateCustomer(customerData);
        } else {
            addCustomer(customerData as Omit<Customer, 'id'>);
        }
        setIsModalOpen(false);
    };
    
    const getPrimaryInfo = (customer: Customer) => {
        const pContact = customer.contacts.find(c => c.isPrimary) || customer.contacts[0];
        const pLocation = customer.locations.find(l => l.isPrimary) || customer.locations[0];
        return { pContact, pLocation };
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {customers.map(customer => {
                    const {pContact, pLocation} = getPrimaryInfo(customer);
                    return (
                        <div key={customer.id} onClick={() => navigate(`/customers/${customer.id}`)} className="bg-white p-4 rounded-lg shadow space-y-2 cursor-pointer hover:shadow-lg transition-shadow">
                            <h3 className="font-bold text-lg text-brand-dark">{customer.householdName}</h3>
                            {pContact && <p className="text-sm text-slate-600 font-semibold">{pContact.name}</p>}
                            {pLocation && (
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pLocation.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-start text-sm text-brand-secondary hover:underline"
                                >
                                    <MapPinIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                    <span>{pLocation.address}</span>
                                </a>
                            )}
                            {pContact && (
                                <a
                                    href={`tel:${pContact.phone}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center text-sm text-brand-secondary hover:underline"
                                >
                                    <PhoneIcon className="w-4 h-4 mr-1" />
                                    <span>{pContact.phone}</span>
                                </a>
                            )}
                            <div className="pt-2 border-t flex justify-end space-x-2">
                                <button onClick={(e) => handleEditClick(e, customer)} className="p-2 text-slate-500 hover:text-brand-primary"><PencilIcon className="w-5 h-5" /></button>
                                <button onClick={(e) => handleDeleteClick(e, customer.id)} className="p-2 text-slate-500 hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                    )
                })}
            </div>

             <button onClick={handleAddClick} className="fixed bottom-24 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-brand-dark transition-transform hover:scale-110">
                <PlusIcon className="w-6 h-6" />
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}>
                <CustomerForm 
                    customer={editingCustomer}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default CustomersPage;