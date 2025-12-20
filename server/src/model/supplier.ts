export interface Supplier {
  id: number;                     // matches Prisma id
  name: string;                   // supplier name
  category: string | null;        // supplier category (e.g., IT, Furniture)
  status: string;                  // active/inactive/suspended
  contactPerson?: string | null;   // optional
  phone?: string | null;           // optional
  email?: string | null;           // optional
  address?: string | null;         // optional
  website?: string | null;         // optional
  registrationDate?: Date | null;  // optional
  lastOrderDate?: Date | null;     // optional
  totalOrders?: number | null;     // optional
  rating?: number | null;          // 1–5
  notes?: string | null;           // optional
  createdAt: Date;                 // timestamp
  updatedAt: Date;                 // timestamp
}
