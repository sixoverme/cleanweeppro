export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum InvoiceStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
}

export enum BillingType {
  FIXED = 'Fixed',
  HOURLY = 'Hourly',
}

export interface BusinessInfo {
  name: string;
  logo: string; // base64 string
  address: string;
}

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface Location {
  id:string;
  address: string;
  label: string; // e.g., Home, Office
  isPrimary: boolean;
}

export interface Pet {
  id: string;
  type: string; // e.g., Dog, Cat
  notes: string;
}

export interface Kid {
  id: string;
  name: string;
  notes: string;
}

export interface Customer {
  id: string;
  householdName: string;
  contacts: Contact[];
  locations: Location[];
  pets: Pet[];
  kids: Kid[];
  houseNotes: string;
  cleaningFrequency: string;
}


export interface Appointment {
  id: string;
  customerId: string;
  locationId: string;
  date: string; // ISO 8601 format
  time: string; // e.g., "10:00 AM"
  services: string[];
  status: AppointmentStatus;
  billingType: BillingType;
  amount: number;
  estimatedHours?: number;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  lowStockThreshold: number;
  purchaseLocation?: string;
  cost?: number;
  notes?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  appointmentId: string;
  issueDate: string; // ISO 8601 format
  dueDate: string; // ISO 8601 format
  amount: number;
  status: InvoiceStatus;
}