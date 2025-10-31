
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Appointment, AppointmentStatus, BillingType, Location } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, MapPinIcon, PhoneIcon, ListBulletIcon, CalendarDaysIcon } from './Icons';
import AppointmentCalendar from './AppointmentCalendar';

// Reusing Modal from CustomersPage concept - defining a generic one for use here.
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

// AppointmentForm Component
interface AppointmentFormProps {
    appointment?: Appointment | null;
    onSave: (appointment: Omit<Appointment, 'id'> | Appointment) => void;
    onClose: () => void;
}
const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onSave, onClose }) => {
    const { customers } = useAppContext();
    const [formData, setFormData] = useState({
        customerId: appointment?.customerId || '',
        locationId: appointment?.locationId || '',
        date: appointment?.date || '',
        time: appointment?.time || '',
        services: appointment?.services.join(', ') || '',
        status: appointment?.status || AppointmentStatus.SCHEDULED,
        billingType: appointment?.billingType || BillingType.FIXED,
        amount: appointment?.amount ?? '',
        estimatedHours: appointment?.estimatedHours ?? '',
        notes: appointment?.notes || '',
    });
    const [selectedCustomerLocations, setSelectedCustomerLocations] = useState<Location[]>([]);

    useEffect(() => {
        if (appointment?.customerId) {
            const customer = customers.find(c => c.id === appointment.customerId);
            setSelectedCustomerLocations(customer?.locations || []);
        }
    }, [appointment, customers]);

    useEffect(() => {
        if (formData.customerId) {
            const customer = customers.find(c => c.id === formData.customerId);
            setSelectedCustomerLocations(customer?.locations || []);
        } else {
            setSelectedCustomerLocations([]);
        }
    }, [formData.customerId, customers]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'customerId') {
            setFormData(prev => ({ ...prev, customerId: value, locationId: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            services: formData.services.split(',').map(s => s.trim()),
            amount: parseFloat(String(formData.amount)) || 0,
            estimatedHours: formData.billingType === BillingType.HOURLY ? (parseFloat(String(formData.estimatedHours)) || 0) : undefined,
        };
        onSave(appointment ? { ...appointment, ...finalData } : finalData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <select name="customerId" value={formData.customerId} onChange={handleChange} className="w-full p-2 border rounded" required>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.householdName}</option>)}
            </select>
            <select name="locationId" value={formData.locationId} onChange={handleChange} className="w-full p-2 border rounded" required disabled={!formData.customerId}>
                <option value="">Select Location</option>
                {selectedCustomerLocations.map(loc => <option key={loc.id} value={loc.id}>{loc.label} - {loc.address}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <input name="services" value={formData.services} onChange={handleChange} placeholder="Services (comma-separated)" className="w-full p-2 border rounded" />
            
            <div className="space-y-2">
                <label className="font-semibold text-slate-700">Billing Type</label>
                <div className="flex gap-4 p-2 bg-slate-50 rounded-md">
                    <label className="flex items-center w-full">
                        <input type="radio" name="billingType" value={BillingType.FIXED} checked={formData.billingType === BillingType.FIXED} onChange={handleChange} className="mr-2" />
                        Fixed Price
                    </label>
                    <label className="flex items-center w-full">
                        <input type="radio" name="billingType" value={BillingType.HOURLY} checked={formData.billingType === BillingType.HOURLY} onChange={handleChange} className="mr-2" />
                        Hourly
                    </label>
                </div>
            </div>

            {formData.billingType === BillingType.FIXED ? (
                <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} placeholder="Total Amount" className="w-full p-2 border rounded" required/>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} placeholder="Rate per Hour" className="w-full p-2 border rounded" required/>
                    <input type="number" step="0.1" name="estimatedHours" value={formData.estimatedHours} onChange={handleChange} placeholder="Est. Hours" className="w-full p-2 border rounded"/>
                </div>
            )}

            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Appointment Notes..." className="w-full p-2 border rounded" rows={3}></textarea>
            
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                {Object.values(AppointmentStatus).map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Save Appointment</button>
            </div>
        </form>
    );
};

const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
        case AppointmentStatus.SCHEDULED: return 'bg-blue-100 text-blue-800';
        case AppointmentStatus.COMPLETED: return 'bg-green-100 text-green-800';
        case AppointmentStatus.CANCELLED: return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const getAppointmentPrice = (appointment: Appointment): number => {
    if (appointment.billingType === BillingType.HOURLY) {
        return appointment.amount * (appointment.estimatedHours || 0);
    }
    return appointment.amount;
};

const AppointmentsPage: React.FC = () => {
    const { appointments, customers, addAppointment, updateAppointment, deleteAppointment } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [view, setView] = useState<'list' | 'calendar'>('list');

    const handleAddClick = () => {
        setEditingAppointment(null);
        setIsModalOpen(true);
    };
    
    const handleEditClick = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setIsModalOpen(true);
    };
    
    const handleSave = (appointment: Omit<Appointment, 'id'> | Appointment) => {
        if ('id' in appointment) {
            updateAppointment(appointment);
        } else {
            addAppointment(appointment);
        }
        setIsModalOpen(false);
    };

    const getCustomerInfo = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        if (!customer) return { name: 'Unknown', primaryContact: null, locations: [] };
        const primaryContact = customer.contacts.find(c => c.isPrimary) || customer.contacts[0];
        return { name: customer.householdName, primaryContact, locations: customer.locations };
    };

    const sortedAppointments = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-4">
            <div className="flex justify-center mb-4">
                <div className="inline-flex rounded-lg shadow-sm bg-slate-100 p-1">
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 text-sm font-medium flex items-center gap-2 rounded-md transition-colors ${view === 'list' ? 'bg-brand-primary text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                        aria-pressed={view === 'list'}
                    >
                        <ListBulletIcon className="w-5 h-5" />
                        List
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`px-4 py-2 text-sm font-medium flex items-center gap-2 rounded-md transition-colors ${view === 'calendar' ? 'bg-brand-primary text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                         aria-pressed={view === 'calendar'}
                    >
                        <CalendarDaysIcon className="w-5 h-5" />
                        Calendar
                    </button>
                </div>
            </div>

            {view === 'list' ? (
                <div className="space-y-4">
                    {sortedAppointments.map(appt => {
                        const { name, primaryContact, locations } = getCustomerInfo(appt.customerId);
                        const location = locations.find(l => l.id === appt.locationId);
                        return (
                        <div key={appt.id} className="bg-white p-4 rounded-lg shadow space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg text-brand-dark">{name}</h3>
                                    <p className="text-sm text-slate-500">{new Date(appt.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} at {appt.time}</p>
                                    {location && (
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-brand-secondary hover:underline">
                                            <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" /> {location.address}
                                        </a>
                                    )}
                                    {primaryContact && (
                                        <a href={`tel:${primaryContact.phone}`} className="flex items-center text-sm text-brand-secondary hover:underline">
                                            <PhoneIcon className="w-4 h-4 mr-1.5 flex-shrink-0" /> {primaryContact.phone}
                                        </a>
                                    )}
                                    <p className="text-sm text-slate-600 pt-1">{appt.services.join(', ')}</p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appt.status)}`}>{appt.status}</span>
                                     <p className="font-bold text-lg text-slate-800 mt-1">${getAppointmentPrice(appt).toFixed(2)}</p>
                                     {appt.billingType === BillingType.HOURLY && (
                                        <p className="text-xs text-slate-500">${appt.amount}/hr for {appt.estimatedHours}hr</p>
                                    )}
                                </div>
                            </div>
                             {appt.notes && (
                                <div className="pt-2 mt-2 border-t">
                                    <p className="text-sm text-slate-600 whitespace-pre-wrap"><span className="font-semibold">Notes:</span> {appt.notes}</p>
                                </div>
                            )}
                            <div className="pt-2 mt-2 border-t flex justify-end space-x-2">
                                <button onClick={() => handleEditClick(appt)} className="p-2 text-slate-500 hover:text-brand-primary"><PencilIcon className="w-5 h-5" /></button>
                                <button onClick={() => deleteAppointment(appt.id)} className="p-2 text-slate-500 hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                    )})}
                </div>
            ) : (
                <AppointmentCalendar onAppointmentClick={handleEditClick} />
            )}
            
            <button onClick={handleAddClick} className="fixed bottom-24 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-brand-dark transition-transform hover:scale-110">
                <PlusIcon className="w-6 h-6" />
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}>
                <AppointmentForm
                    appointment={editingAppointment}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default AppointmentsPage;