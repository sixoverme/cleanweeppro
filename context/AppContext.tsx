
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Customer, Appointment, InventoryItem, Invoice, AppointmentStatus, InvoiceStatus, BillingType, BusinessInfo } from '../types';
import { MOCK_CUSTOMERS, MOCK_APPOINTMENTS, MOCK_INVENTORY, MOCK_INVOICES } from '../constants';

interface AppContextType {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  businessInfo: BusinessInfo;
  updateBusinessInfo: (info: BusinessInfo) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (appointmentId: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (itemId: string) => void;
  createInvoiceForAppointment: (appointmentId: string) => void;
  updateInvoice: (invoice: Invoice) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', MOCK_CUSTOMERS);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', MOCK_APPOINTMENTS);
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('inventory', MOCK_INVENTORY);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', MOCK_INVOICES);
  const [businessInfo, setBusinessInfo] = useLocalStorage<BusinessInfo>('businessInfo', {
    name: 'CleanSweep Pro',
    logo: '',
    address: '123 Cleaning Ave.\nSuite 100\nAnytown, USA 12345',
  });

  const updateBusinessInfo = (info: BusinessInfo) => {
    setBusinessInfo(info);
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    setCustomers(prev => [...prev, { ...customer, id: crypto.randomUUID() }]);
  };
  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };
  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };
  
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    setAppointments(prev => [...prev, { ...appointment, id: crypto.randomUUID() }]);
  };
  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
  };
  const deleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(a => a.id !== appointmentId));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    setInventory(prev => [...prev, { ...item, id: crypto.randomUUID() }]);
  };
  const updateInventoryItem = (updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };
  const deleteInventoryItem = (itemId: string) => {
    setInventory(prev => prev.filter(i => i.id !== itemId));
  };

  const createInvoiceForAppointment = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    let invoiceAmount = 0;
    if (appointment.billingType === BillingType.FIXED) {
      invoiceAmount = appointment.amount;
    } else if (appointment.billingType === BillingType.HOURLY) {
      invoiceAmount = appointment.amount * (appointment.estimatedHours || 1);
    }

    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      customerId: appointment.customerId,
      appointmentId: appointment.id,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      amount: invoiceAmount,
      status: InvoiceStatus.DRAFT,
    };
    setInvoices(prev => [...prev, newInvoice]);
  };
  
  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(i => i.id === updatedInvoice.id ? updatedInvoice : i));
  };
  

  const value = {
    customers, setCustomers,
    appointments, setAppointments,
    inventory, setInventory,
    invoices, setInvoices,
    businessInfo, updateBusinessInfo,
    addCustomer, updateCustomer, deleteCustomer,
    addAppointment, updateAppointment, deleteAppointment,
    addInventoryItem, updateInventoryItem, deleteInventoryItem,
    createInvoiceForAppointment, updateInvoice,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};