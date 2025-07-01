import type { Piano } from './piano';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  address: string;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  companyName?: string | null;
  referralCode?: string | null;
  textUpdates?: boolean;
  emailUpdates?: boolean;
  createdAt: string;
  updatedAt: string;
  pianos?: Piano[];
} 