
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Appointment, AppointmentStatus, BillingType } from '../types';
import { CalendarIcon, UsersIcon, ArchiveBoxIcon } from './Icons';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
}

const getAppointmentPrice = (appointment: Appointment): number => {
    if (appointment.billingType === BillingType.HOURLY) {
        return appointment.amount * (appointment.estimatedHours || 0);
    }
    return appointment.amount;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 transition-transform hover:scale-105">
    <div className="bg-brand-light p-3 rounded-full">
      <Icon className="h-8 w-8 text-brand-primary" />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const UpcomingAppointments: React.FC = () => {
  const { appointments, customers } = useAppContext();
  const upcoming = appointments
    .filter(a => new Date(a.date) >= new Date() && a.status === AppointmentStatus.SCHEDULED)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const getCustomerInfo = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return { name: 'Unknown', primaryContact: null, locations: [] };
    const primaryContact = customer.contacts.find(c => c.isPrimary) || customer.contacts[0];
    return { name: customer.householdName, primaryContact, locations: customer.locations };
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Upcoming Appointments</h3>
      {upcoming.length === 0 ? (
        <p className="text-slate-500">No upcoming appointments.</p>
      ) : (
        <ul className="space-y-4">
          {upcoming.map(appt => {
            const { name, primaryContact, locations } = getCustomerInfo(appt.customerId);
            const location = locations.find(l => l.id === appt.locationId);
            return (
            <li key={appt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="space-y-1">
                <p className="font-semibold text-slate-700">{name}</p>
                <p className="text-sm text-slate-500">
                  {new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {appt.time}
                </p>
                {location && (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-secondary hover:underline block">
                        {location.address}
                    </a>
                )}
                {primaryContact && (
                    <a href={`tel:${primaryContact.phone}`} className="text-sm text-brand-secondary hover:underline block">
                        {primaryContact.phone}
                    </a>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-brand-primary">${getAppointmentPrice(appt).toFixed(2)}</p>
                {appt.billingType === BillingType.HOURLY && <p className="text-xs text-slate-500">${appt.amount}/hr</p>}
              </div>
            </li>
          )})}
        </ul>
      )}
    </div>
  );
};

const EarningsSummary: React.FC = () => {
    const { appointments } = useAppContext();

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Get Monday of the current week
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(new Date(today).setDate(diffToMonday));
    const mondayStr = monday.toISOString().split('T')[0];
    
    // Get Friday of the current week
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    const fridayStr = friday.toISOString().split('T')[0];
    
    const earningsToday = appointments
        .filter(a => a.date === todayStr && a.status === AppointmentStatus.COMPLETED)
        .reduce((sum, a) => sum + getAppointmentPrice(a), 0);
        
    const earningsWTD = appointments
        .filter(a => a.date >= mondayStr && a.date <= todayStr && a.status === AppointmentStatus.COMPLETED)
        .reduce((sum, a) => sum + getAppointmentPrice(a), 0);

    const potentialThisWeek = appointments
        .filter(a => a.date >= mondayStr && a.date <= fridayStr && (a.status === AppointmentStatus.COMPLETED || a.status === AppointmentStatus.SCHEDULED))
        .reduce((sum, a) => sum + getAppointmentPrice(a), 0);
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Earnings Snapshot</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-500">Earnings Today</p>
              <p className="text-2xl font-bold text-brand-primary">${earningsToday.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-500">Earnings WTD</p>
              <p className="text-2xl font-bold text-brand-primary">${earningsWTD.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-500">Earning Potential This Week</p>
              <p className="text-2xl font-bold text-brand-primary">${potentialThisWeek.toFixed(2)}</p>
            </div>
          </div>
        </div>
      );
};


const Dashboard: React.FC = () => {
  const { appointments, customers, inventory } = useAppContext();

  const upcomingAppointmentsCount = appointments.filter(a => new Date(a.date) >= new Date() && a.status === AppointmentStatus.SCHEDULED).length;
  const lowStockItemsCount = inventory.filter(i => i.quantity <= i.lowStockThreshold).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Upcoming Jobs" value={upcomingAppointmentsCount} icon={CalendarIcon} />
        <SummaryCard title="Active Clients" value={customers.length} icon={UsersIcon} />
        <SummaryCard title="Low Stock Items" value={lowStockItemsCount} icon={ArchiveBoxIcon} />
      </div>

      <EarningsSummary />
      
      <UpcomingAppointments />
    </div>
  );
};

export default Dashboard;