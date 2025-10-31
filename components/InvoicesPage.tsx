import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Invoice, InvoiceStatus, AppointmentStatus } from '../types';

const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
        case InvoiceStatus.PAID: return 'bg-green-100 text-green-800';
        case InvoiceStatus.SENT: return 'bg-blue-100 text-blue-800';
        case InvoiceStatus.DRAFT: return 'bg-slate-100 text-slate-800';
        case InvoiceStatus.OVERDUE: return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const InvoicesPage: React.FC = () => {
    const { invoices, customers, appointments, createInvoiceForAppointment } = useAppContext();
    const navigate = useNavigate();

    const getCustomerName = (customerId: string) => customers.find(c => c.id === customerId)?.householdName || 'Unknown';

    // Find completed appointments that don't have an invoice yet
    const completetedAppointmentsWithoutInvoice = appointments.filter(appt => 
        appt.status === AppointmentStatus.COMPLETED &&
        !invoices.some(inv => inv.appointmentId === appt.id)
    );

    return (
        <div className="space-y-6">
            {completetedAppointmentsWithoutInvoice.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-bold mb-2">Ready to Invoice</h3>
                    <ul className="space-y-2">
                        {completetedAppointmentsWithoutInvoice.map(appt => (
                            <li key={appt.id} className="p-3 bg-blue-50 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{getCustomerName(appt.customerId)}</p>
                                    <p className="text-sm text-slate-500">Completed on {new Date(appt.date).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => createInvoiceForAppointment(appt.id)}
                                    className="px-3 py-1 bg-brand-secondary text-white text-sm rounded-md hover:bg-brand-primary"
                                >
                                    Create Invoice
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="space-y-4">
                {invoices.map(invoice => (
                    <div 
                        key={invoice.id} 
                        className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                    >
                         <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-brand-dark">{getCustomerName(invoice.customerId)}</h3>
                                <p className="text-sm text-slate-500">Invoice #{invoice.id}</p>
                                <p className="text-sm text-slate-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-xl text-slate-800">${invoice.amount.toFixed(2)}</p>
                                <span className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                                    {invoice.status}
                                </span>
                            </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvoicesPage;