export interface Piano {
  id: string;
  type: string;
  brand?: string | null;
  year?: number | string | null;
  model?: string | null;
  serialNumber?: string | null;
  lastServiceDate?: string | null;
  notes?: string | null;
  photoUrl?: string | null;
} 