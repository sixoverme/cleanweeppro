import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Appointment, AppointmentStatus, BillingType } from '../types';
import { ChevronLeftIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, UserCircleIcon } from './Icons';

const DetailSection: React.FC<{title: string, children: React.ReactNode, noDataText?: string}> = ({ title, children }) => (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const getAppointmentPrice = (appointment: Appointment): number => {
    if (appointment.billingType === BillingType.HOURLY) {
        return appointment.amount * (appointment.estimatedHours || 0);
    }
    return appointment.amount;
};

const CustomerDetailPage: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const { customers, appointments } = useAppContext();
    const navigate = useNavigate();

    const customer = customers.find(c => c.id === customerId);

    if (!customer) {
        return (
            <div className="text-center">
                <p>Customer not found.</p>
                <button onClick={() => navigate('/customers')} className="mt-4 px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-dark">
                    Back to Customers
                </button>
            </div>
        );
    }
    
    const customerAppointments = appointments.filter(a => a.customerId === customer.id);
    const upcomingAppointments = customerAppointments
        .filter(a => new Date(a.date) >= new Date() && a.status === AppointmentStatus.SCHEDULED)
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const pastAppointments = customerAppointments
        .filter(a => new Date(a.date) < new Date() || a.status !== AppointmentStatus.SCHEDULED)
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getPrimaryContact = () => customer.contacts.find(c => c.isPrimary) || customer.contacts[0];
    const primaryContact = getPrimaryContact();

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-2">
                <button onClick={() => navigate('/customers')} className="p-2 rounded-full hover:bg-slate-200" aria-label="Back to Customers">
                    <ChevronLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <div className="ml-2">
                     <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{customer.householdName}</h2>
                     {primaryContact && <p className="text-slate-500">Primary Contact: {primaryContact.name}</p>}
                </div>
            </div>

            <DetailSection title="Contacts">
                {customer.contacts.map(contact => (
                    <div key={contact.id} className="p-3 bg-slate-50 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
                       <div className="flex items-center mb-2 sm:mb-0">
                          {contact.isPrimary && <UserCircleIcon className="w-6 h-6 text-brand-primary mr-3 flex-shrink-0" title="Primary Contact"/>}
                           <div className={!contact.isPrimary ? 'sm:ml-9' : ''}>
                                <p className="font-semibold text-slate-700">{contact.name} <span className="text-sm font-normal text-slate-500">({contact.relationship})</span></p>
                                <a href={`tel:${contact.phone}`} className="flex items-center text-sm text-brand-secondary hover:underline">
                                    <PhoneIcon className="w-4 h-4 mr-1.5"/> {contact.phone}
                                </a>
                                <a href={`mailto:${contact.email}`} className="flex items-center text-sm text-brand-secondary hover:underline">
                                    <EnvelopeIcon className="w-4 h-4 mr-1.5"/> {contact.email}
                                </a>
                           </div>
                       </div>
                    </div>
                ))}
            </DetailSection>

            <DetailSection title="Locations">
                {customer.locations.map(location => (
                     <div key={location.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-start">
                             {location.isPrimary && <MapPinIcon className="w-6 h-6 text-brand-primary mr-3 mt-0.5 flex-shrink-0" title="Primary Location" />}
                            <div className={!location.isPrimary ? 'sm:ml-9' : ''}>
                                <p className="font-semibold text-slate-700">{location.label}</p>
                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">
                                    {location.address}
                                </a>
                            </div>
                        </div>
                     </div>
                ))}
            </DetailSection>

            {(customer.pets.length > 0 || customer.kids.length > 0) &&
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customer.pets.length > 0 && 
                        <DetailSection title="Pets">
                            {customer.pets.map(pet => (
                                <div key={pet.id}>
                                    <p className="font-semibold text-slate-700">{pet.type}</p>
                                    <p className="text-sm text-slate-500 pl-2 border-l-2 border-slate-200 ml-1 mt-1">{pet.notes}</p>
                                </div>
                            ))}
                        </DetailSection>
                    }
                     {customer.kids.length > 0 && 
                        <DetailSection title="Kids">
                           {customer.kids.map(kid => (
                                <div key={kid.id}>
                                    <p className="font-semibold text-slate-700">{kid.name}</p>
                                    <p className="text-sm text-slate-500 pl-2 border-l-2 border-slate-200 ml-1 mt-1">{kid.notes}</p>
                                </div>
                            ))}
                        </DetailSection>
                    }
                </div>
            }

            {customer.houseNotes &&
                <DetailSection title="House Notes">
                    <p className="text-slate-600 whitespace-pre-wrap">{customer.houseNotes}</p>
                </DetailSection>
            }

            <DetailSection title="Upcoming Jobs">
                {upcomingAppointments.length > 0 ? upcomingAppointments.map(job => (
                    <div key={job.id} className="p-3 bg-blue-50 rounded-lg">
                       <p className="font-semibold">{new Date(job.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} @ {job.time}</p>
                       <p className="text-sm text-slate-600">{job.services.join(', ')} - ${getAppointmentPrice(job).toFixed(2)}</p>
                    </div>
                )) : <p className="text-slate-500">No upcoming jobs.</p>}
            </DetailSection>

             <DetailSection title="Past Jobs">
                {pastAppointments.length > 0 ? pastAppointments.map(job => (
                    <div key={job.id} className="p-3 bg-slate-50 rounded-lg">
                        <p className="font-semibold">{new Date(job.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-sm text-slate-600">{job.services.join(', ')} - ${getAppointmentPrice(job).toFixed(2)}</p>
                        <p className="text-sm font-bold text-slate-700">Status: {job.status}</p>
                    </div>
                )) : <p className="text-slate-500">No past jobs.</p>}
            </DetailSection>
        </div>
    );
};

export default CustomerDetailPage;