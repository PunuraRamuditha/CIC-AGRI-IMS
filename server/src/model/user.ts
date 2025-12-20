export interface User {
  id: number;                     // matches Prisma id
  name: string;                   // required
  username: string | null;               // required, unique
  password: string | null;               // required
  email: string;                  // required, unique
  role: string;                   // foreign key -> Role table
  department: string;             // foreign key -> Department table
  status: string;                 // foreign key -> Status table
  phone?: string | null;          // optional nullable
  joinDate?: Date | null;         // optional, when user joined
  lastLogin?: Date | null;        // optional, last login timestamp
  permissions?: string | null;  // optional, array of permissions/roles
  createdAt: Date;                // Prisma @createdAt
  updatedAt: Date;                // Prisma @updatedAt
}
