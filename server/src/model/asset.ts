import { Decimal } from "@prisma/client/runtime/library";

export interface Asset {
  id: number;                     // matches Prisma id
  assetCode: string;            // unique
  name: string;                   // matches Prisma name
  category: string;             // foreign key
  status: string;               // foreign key
  assignedTo?: number | null;     // optional nullable
  location: string;             // foreign key
  company: string;              // foreign key
  purchaseDate: Date;             // matches Prisma purchaseDate
  purchasePrice: Decimal;          // matches Prisma purchasePrice
  model?: string | null;          // optional
  serialNumber?: string | null;   // optional
  description?: string | null;    // optional field
  invoiceNumber?: string | null; // optional
  supplier?: string | null;       // optional
  warranty?: number | null;       // months
  warrantyExpiry?: Date | null;   // optional
  lastMaintenance?: Date | null;  // optional
  specifications?: string | null; // optional
  createdAt: Date;                // timestamps (if using Prisma @createdAt)
  updatedAt: Date;                // timestamps (if using Prisma @updatedAt)
}
