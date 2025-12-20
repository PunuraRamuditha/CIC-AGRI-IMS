// DTO for creating a new user
export interface CreateUserDTO {
  name: string;                  // required
  email: string;                 // required, must be unique
  username: string;               // required, must be unique
  password: string;               // required
  role: string;                  // required foreign key
  department: string;           // required foreign key
  status: string;                // required foreign key
  phone?: string;                // optional
  joinDate?: Date;               // optional (can default to current date)
  lastLogin?: Date;              // optional
  permissions?: string[];        // optional (array of permission keys)
}

// DTO for updating an existing user
export interface UpdateUserDTO {
  password?: string; 
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  status?: string;
  phone?: string;
  joinDate?: Date;
  lastLogin?: Date;
  permissions?: string[];
}
