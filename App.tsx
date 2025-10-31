
import React, { useState } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CustomersPage from './components/CustomersPage';
import CustomerDetailPage from './components/CustomerDetailPage';
import AppointmentsPage from './components/AppointmentsPage';
import InventoryPage from './components/InventoryPage';
import InventoryDetailPage from './components/InventoryDetailPage';
import InvoicesPage from './components/InvoicesPage';
import InvoiceDetailPage from './components/InvoiceDetailPage';
import BusinessInfoForm from './components/BusinessInfoForm';
import { HomeIcon, UsersIcon, CalendarIcon, ArchiveBoxIcon, DocumentTextIcon, UserCircleIcon } from './components/Icons';

const navItems = [
  { path: '/', label: 'Dashboard', icon: HomeIcon },
  { path: '/customers', label: 'Customers', icon: UsersIcon },
  { path: '/appointments', label: 'Appointments', icon: CalendarIcon },
  { path: '/inventory', label: 'Inventory', icon: ArchiveBoxIcon },
  { path: '/invoices', label: 'Invoices', icon: DocumentTextIcon },
];

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
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


const PageHeader: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <header className="bg-brand-primary text-white shadow-md sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold">CleanSweep Pro</h1>
                    <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-full hover:bg-brand-dark" aria-label="Business Settings">
                        <UserCircleIcon className="w-7 h-7 text-white" />
                    </button>
                </div>
            </header>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Business Settings">
                <BusinessInfoForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </>
    );
};


const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] z-20">
      <div className="max-w-4xl mx-auto flex justify-around">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs sm:text-sm transition-colors duration-200 ${
                isActive ? 'text-brand-primary' : 'text-slate-500 hover:text-brand-secondary'
              }`
            }
          >
            <Icon className="h-6 w-6 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

function App() {
  return (
    <HashRouter>
        <div className="flex flex-col h-screen font-sans">
            <PageHeader />
            <main className="flex-1 overflow-y-auto pb-20 bg-slate-100">
                <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/customers" element={<CustomersPage />} />
                        <Route path="/customers/:customerId" element={<CustomerDetailPage />} />
                        <Route path="/appointments" element={<AppointmentsPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/inventory/:itemId" element={<InventoryDetailPage />} />
                        <Route path="/invoices" element={<InvoicesPage />} />
                        <Route path="/invoices/:invoiceId" element={<InvoiceDetailPage />} />
                    </Routes>
                </div>
            </main>
            <BottomNav />
        </div>
    </HashRouter>
  );
}

export default App;