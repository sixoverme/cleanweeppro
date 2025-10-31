
import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, DocumentDownloadIcon } from './Icons';
import { InvoiceStatus, BillingType } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceDetailPage: React.FC = () => {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const { invoices, customers, appointments, businessInfo, updateInvoice } = useAppContext();
    const navigate = useNavigate();
    const invoiceRef = useRef<HTMLDivElement>(null);

    const invoice = invoices.find(i => i.id === invoiceId);

    if (!invoice) {
        return (
            <div className="text-center">
                <p>Invoice not found.</p>
                <button onClick={() => navigate('/invoices')} className="mt-4 px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-dark">
                    Back to Invoices
                </button>
            </div>
        );
    }

    const customer = customers.find(c => c.id === invoice.customerId);
    const appointment = appointments.find(a => a.id === invoice.appointmentId);
    const primaryContact = customer?.contacts.find(c => c.isPrimary) || customer?.contacts[0];
    const primaryLocation = customer?.locations.find(l => l.isPrimary) || customer?.locations[0];

    const handleDownloadPdf = () => {
        const input = invoiceRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'px',
                    format: 'a4',
                });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                const width = pdfWidth;
                const height = width / ratio;

                // if height is bigger than page, scale down
                let finalHeight = height;
                let finalWidth = width;
                if(height > pdfHeight){
                  finalHeight = pdfHeight;
                  finalWidth = finalHeight * ratio;
                }
                
                pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight);
                pdf.save(`Invoice-${invoice.id}.pdf`);
            });
        }
    };
    
    const handleStatusChange = (newStatus: InvoiceStatus) => {
        updateInvoice({ ...invoice, status: newStatus });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <button onClick={() => navigate('/invoices')} className="p-2 rounded-full hover:bg-slate-200" aria-label="Back to Invoices">
                        <ChevronLeftIcon className="w-6 h-6 text-slate-600" />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800 ml-2">Invoice #{invoice.id}</h2>
                </div>
                <button onClick={handleDownloadPdf} className="flex items-center px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-primary">
                    <DocumentDownloadIcon className="w-5 h-5 mr-2" />
                    Download PDF
                </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg" ref={invoiceRef}>
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b">
                    <div>
                        {businessInfo.logo && <img src={businessInfo.logo} alt="Business Logo" className="h-16 w-auto mb-2" />}
                        <h3 className="font-bold text-xl">{businessInfo.name}</h3>
                        <p className="text-sm text-slate-600 whitespace-pre-line">{businessInfo.address}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <h2 className="text-3xl font-bold uppercase text-slate-800">Invoice</h2>
                        <p className="text-sm text-slate-600"><strong>Invoice #:</strong> {invoice.id}</p>
                        <p className="text-sm text-slate-600"><strong>Date Issued:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                        <p className="text-sm text-slate-600"><strong>Date Due:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mt-8">
                    <h4 className="font-semibold text-slate-500 mb-1">Bill To</h4>
                    <p className="font-bold text-slate-800">{customer?.householdName}</p>
                    {primaryContact && <p className="text-slate-600">{primaryContact.name}</p>}
                    {primaryLocation && <p className="text-slate-600">{primaryLocation.address}</p>}
                </div>

                {/* Line Items Table */}
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-slate-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-0">Service Description</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Date of Service</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-right text-sm font-semibold text-slate-900">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    <tr>
                                        <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:w-auto sm:max-w-none sm:pl-0">
                                            {appointment?.services.join(', ') || 'Cleaning Service'}
                                            {appointment?.billingType === BillingType.HOURLY && (
                                                <dl className="font-normal lg:hidden">
                                                    <dt className="sr-only">Date</dt>
                                                    <dd className="mt-1 truncate text-slate-700">{appointment.date}</dd>
                                                </dl>
                                            )}
                                        </td>
                                        <td className="hidden px-3 py-4 text-sm text-slate-500 lg:table-cell">{appointment ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="py-4 pl-3 pr-4 text-right text-sm text-slate-700 sm:pr-0">${invoice.amount.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th scope="row" colSpan={2} className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-slate-900 sm:table-cell sm:pl-0">Total</th>
                                        <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-slate-900 sm:hidden">Total</th>
                                        <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-slate-900 sm:pr-0">${invoice.amount.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-slate-500 border-t pt-4">
                    <p>Thank you for your business!</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                 <label htmlFor="status-select" className="font-semibold text-slate-700">Update Invoice Status</label>
                 <select 
                    id="status-select"
                    value={invoice.status} 
                    onChange={(e) => handleStatusChange(e.target.value as InvoiceStatus)}
                    className="w-full p-2 border rounded bg-slate-50 text-sm mt-2"
                >
                    {Object.values(InvoiceStatus).map(status => (
                        <option key={status} value={status}>Mark as {status}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default InvoiceDetailPage;