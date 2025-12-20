// DTO for creating a new asset
export interface CreateAssetDTO {
  name: string;
  company: string;
  category:string;
   status:string
  location :string
  assetCode: string;        // required, unique
  categoryId: number;          // required foreign key
  statusId: number;            // required foreign key
  companyId: number;           // required foreign key
  locationId: number;          // required foreign key
  assignedTo?: number;         // optional foreign key
  description?: string;        // optional
  purchaseDate: Date;          // required
  purchasePrice: number;       // required
  model?: string;              // optional
  serialNumber?: string;       // optional
  manufacturer?: string;       // optional
  invoiceNumber?: string;      // optional
  supplier?: string;           // optional
  warranty?: number;           // optional (months)
  warrantyExpiry?: Date;       // optional
  lastMaintenance?: Date;      // optional
  specifications?: string;     // optional
}

// DTO for updating an existing asset
export interface UpdateAssetDTO {
  name?: string;
  assetCode?: string;
  categoryId?: number;
  statusId?: number;
  companyId?: number;
  locationId?: number;
  assignedTo?: number;
  description?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  model?: string;
  serialNumber?: string;
  manufacturer?: string;
  supplier?: string;
  warranty?: number;
  warrantyExpiry?: Date;
  lastMaintenance?: Date;
  invoiceNumber?: string;
  specifications?: string;
}
