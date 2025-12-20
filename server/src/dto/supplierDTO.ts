// DTO for creating a new supplier
export interface CreateSupplierDTO {
  name: string;
  category: string;              // Changed from categoryId
  status: string;                // Changed from statusId
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  registrationDate?: Date;
  lastOrderDate?: Date;
  totalOrders?: number;
  rating?: number;
  notes?: string;
}

// DTO for updating an existing supplier
export interface UpdateSupplierDTO {
  name?: string;
  categoryId?: number;
  statusId?: number;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  registrationDate?: Date;
  lastOrderDate?: Date;
  totalOrders?: number;
  rating?: number;
  notes?: string;
}
