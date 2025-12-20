import prisma from "../config/prisma";
import { Supplier } from "../model/supplier";
import { CreateSupplierDTO, UpdateSupplierDTO } from "../dto/supplierDTO";

// Get all suppliers
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  return await prisma.supplier.findMany();
};

// Get supplier by ID
export const getSupplierById = async (id: number): Promise<Supplier | null> => {
  return await prisma.supplier.findUnique({ where: { id } });
};

// Create new supplier
export const createSupplier = async (data: CreateSupplierDTO): Promise<Supplier> => {
  return await prisma.supplier.create({ data });
};

// Update supplier
export const updateSupplier = async (id: number, data: UpdateSupplierDTO): Promise<Supplier> => {
  return await prisma.supplier.update({
    where: { id },
    data,
  });
};

// Delete supplier
export const deleteSupplier = async (id: number): Promise<Supplier> => {
  return await prisma.supplier.delete({ where: { id } });
};
