import prisma from "../config/prisma";
import { User } from "../model/user";
import { CreateUserDTO, UpdateUserDTO } from "../dto/userDTO";
import bcrypt from 'bcryptjs';

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

// Get user by ID
export const getUserById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { id } });
};

// Create new user
export const createUser = async (data: CreateUserDTO): Promise<User> => {
  const { permissions, password, ...rest } = data;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  return await prisma.user.create({ 
    data: {
      ...rest,
      password: hashedPassword,
      permissions: permissions ? JSON.stringify(permissions) : null,
    }
  });
};

// Update user
export const updateUser = async (id: number, data: UpdateUserDTO): Promise<User> => {
  const { permissions, password, ...rest } = data;
  
  // Build the update data object
  const updateData: any = { ...rest };
  
  // Hash password if provided
  if (password) {
    updateData.password = await bcrypt.hash(password, 12);
  }
  
  // Convert permissions array to JSON string if provided
  if (permissions !== undefined) {
    updateData.permissions = JSON.stringify(permissions);
  }
  
  return await prisma.user.update({
    where: { id },
    data: updateData,  // Use updateData, not data
  });
};

// Delete user
export const deleteUser = async (id: number): Promise<User> => {
  return await prisma.user.delete({ where: { id } });
};

// This function is deprecated - authentication is now handled in authController
export const validateUser = async (username: string, password: string): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { email: username }
      ],
      status: 'active'
    }
  });
  
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return null;
};
