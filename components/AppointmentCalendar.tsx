
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Appointment, AppointmentStatus } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface AppointmentCalendarProps {
    onAppointmentClick: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ onAppointmentClick }) => {
    const { appointments, customers } = useAppContext();
    const [currentDate, setCurrentDate] = useState(new Date());

    const getCustomerName = (customerId: string) => customers.find(c => c.id === customerId)?.householdName || 'Unknown';
    
    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.SCHEDULED: return 'bg-blue-500 hover:bg-blue-600';
            case AppointmentStatus.COMPLETED: return 'bg-green-500 hover:bg-green-600';
            case AppointmentStatus.CANCELLED: return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-slate-500 hover:bg-slate-600';
        }
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderHeader = () => {
        const dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' });
        return (
            <div className="flex items-center justify-between py-2 px-1">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100" aria-label="Previous month">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-slate-800">
                    {dateFormat.format(currentDate)}
                </h2>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100" aria-label="Next month">
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const date = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="text-center font-semibold text-sm text-slate-600 py-2" key={i}>
                    {date[i]}
                </div>
            );
        }
        return <div className="grid grid-cols-7">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - monthStart.getDay());
        const endDate = new Date(monthEnd);
        endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

        const rows = [];
        let days = [];
        let day = new Date(startDate);
        const today = new Date();
        today.setHours(0,0,0,0);


        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = new Date(day);
                const dayStr = cloneDay.toISOString().split('T')[0];
                const appointmentsForDay = appointments.filter(a => a.date === dayStr);

                const isCurrentMonth = cloneDay.getMonth() === currentDate.getMonth();
                const isToday = cloneDay.getTime() === today.getTime();
                
                days.push(
                    <div
                        className={`border-t border-r border-slate-200 p-1 h-32 flex flex-col relative ${!isCurrentMonth ? 'bg-slate-50' : 'bg-white'}`}
                        key={day.toString()}
                    >
                        <span className={`text-sm font-medium ${!isCurrentMonth ? 'text-slate-400' : 'text-slate-700'} ${isToday ? 'bg-brand-primary text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>
                            {cloneDay.getDate()}
                        </span>
                        <div className="flex-1 overflow-y-auto mt-1 space-y-1">
                            {appointmentsForDay.map(appt => (
                                <div 
                                    key={appt.id}
                                    onClick={() => onAppointmentClick(appt)}
                                    className={`text-white text-xs p-1 rounded-md truncate cursor-pointer transition-colors ${getStatusColor(appt.status)}`}
                                    title={`${getCustomerName(appt.customerId)}\n${appt.time}\n${appt.services.join(', ')}`}
                                >
                                    {getCustomerName(appt.customerId)}
                                </div>
                            ))}
                        </div>
                    </div>
                );
                day.setDate(day.getDate() + 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="border-l border-b border-slate-200">{rows}</div>;
    };


    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default AppointmentCalendar;