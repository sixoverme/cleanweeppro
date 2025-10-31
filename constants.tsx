
import { Customer, Appointment, InventoryItem, Invoice, AppointmentStatus, InvoiceStatus, BillingType } from './types.ts';

export const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: 'cust1', 
    householdName: 'Doe Residence', 
    cleaningFrequency: 'Bi-Weekly',
    contacts: [
      { id: 'cont1-1', name: 'John Doe', relationship: 'Husband', phone: '555-1234', email: 'john.d@example.com', isPrimary: true },
      { id: 'cont1-2', name: 'Jane Doe', relationship: 'Wife', phone: '555-1235', email: 'jane.d@example.com', isPrimary: false },
    ],
    locations: [
      { id: 'loc1-1', address: '123 Maple St, Springfield, IL 62704', label: 'Home', isPrimary: true },
      { id: 'loc1-2', address: '999 Business Blvd, Springfield, IL 62701', label: 'Office', isPrimary: false },
    ],
    pets: [
      { id: 'pet1-1', type: 'Dog', notes: 'Friendly Golden Retriever named Max. Sheds a lot.' },
    ],
    kids: [],
    houseNotes: 'Please use the side door for entry. Be careful with the antique vase in the living room.',
  },
  { 
    id: 'cust2', 
    householdName: 'Smith Household', 
    cleaningFrequency: 'Monthly',
    contacts: [
      { id: 'cont2-1', name: 'Jane Smith', relationship: 'Owner', phone: '555-5678', email: 'jane.s@example.com', isPrimary: true },
    ],
    locations: [
      { id: 'loc2-1', address: '456 Oak Ave, Shelbyville, IL 62565', label: 'Main House', isPrimary: true },
    ],
    pets: [
      { id: 'pet2-1', type: 'Cat', notes: 'Shy black cat named Luna. Might hide.' },
      { id: 'pet2-2', type: 'Cat', notes: 'Orange tabby named Oliver. Very curious.' },
    ],
    kids: [
      { id: 'kid2-1', name: 'Timmy', notes: 'Age 8. Room is usually messy.' },
    ],
    houseNotes: 'Allergic to lavender. Please use only the unscented products we provide under the sink.',
  },
  { 
    id: 'cust3', 
    householdName: 'Bob Johnson', 
    cleaningFrequency: 'Weekly',
    contacts: [
      { id: 'cont3-1', name: 'Bob Johnson', relationship: 'Owner', phone: '555-8765', email: 'bob.j@example.com', isPrimary: true },
    ],
    locations: [
      { id: 'loc3-1', address: '789 Pine Ln, Capital City, IL 62701', label: 'Home', isPrimary: true },
    ],
    pets: [],
    kids: [],
    houseNotes: 'Key is under the mat. Please focus on deep cleaning the kitchen and master bathroom each visit.',
  },
];


export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'appt1', customerId: 'cust1', locationId: 'loc1-1', date: new Date().toISOString().split('T')[0], time: '09:00 AM', services: ['Standard Clean'], status: AppointmentStatus.SCHEDULED, billingType: BillingType.FIXED, amount: 150, notes: 'Please focus on the kitchen floors.' },
  { id: 'appt2', customerId: 'cust2', locationId: 'loc2-1', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '01:00 PM', services: ['Deep Clean', 'Window Washing'], status: AppointmentStatus.SCHEDULED, billingType: BillingType.HOURLY, amount: 50, estimatedHours: 4, notes: 'Bring the tall ladder for the high windows.' },
  { id: 'appt3', customerId: 'cust3', locationId: 'loc3-1', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '11:00 AM', services: ['Standard Clean'], status: AppointmentStatus.COMPLETED, billingType: BillingType.FIXED, amount: 120 },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'All-Purpose Cleaner', quantity: 5, lowStockThreshold: 2, purchaseLocation: 'Supply Co.', cost: 12.50, notes: 'Concentrated, dilute before use.' },
  { id: 'inv2', name: 'Glass Cleaner', quantity: 2, lowStockThreshold: 3, purchaseLocation: 'Amazon', cost: 8.75, notes: 'Streak-free formula.' },
  { id: 'inv3', name: 'Microfiber Cloths', quantity: 50, lowStockThreshold: 20, purchaseLocation: 'Costco', cost: 25.00, notes: 'Pack of 100.' },
  { id: 'inv4', name: 'Trash Bags (Large)', quantity: 8, lowStockThreshold: 5, purchaseLocation: 'Home Depot', cost: 15.20, notes: '33-gallon, heavy duty.' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv1', customerId: 'cust3', appointmentId: 'appt3', issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 120, status: InvoiceStatus.PAID },
  { id: 'inv2', customerId: 'cust1', appointmentId: 'appt1', issueDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 150, status: InvoiceStatus.DRAFT },
];