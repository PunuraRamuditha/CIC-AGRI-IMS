import { Request, Response, RequestHandler } from "express";
import * as supplierService from "../services/supplierService";
import { CreateSupplierDTO, UpdateSupplierDTO } from "../dto/supplierDTO";

// GET all suppliers
export const getAllSuppliers: RequestHandler = async (_req: Request, res: Response) => {
  const suppliers = await supplierService.getAllSuppliers();
  res.json(suppliers);
};

// GET supplier by ID
export const getSupplierById: RequestHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const supplier = await supplierService.getSupplierById(id);
  if (!supplier) {
    res.status(404).json({ message: "Supplier not found" });
    return;
  }
  res.json(supplier);
};

// CREATE supplier
export const createSupplier: RequestHandler = async (req: Request, res: Response) => {
  const data: CreateSupplierDTO = req.body;
  const newSupplier = await supplierService.createSupplier(data);
  res.status(201).json(newSupplier);
};

// UPDATE supplier
export const updateSupplier: RequestHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data: UpdateSupplierDTO = req.body;
  const updated = await supplierService.updateSupplier(id, data);
  res.json(updated);
};

// DELETE supplier
export const deleteSupplier: RequestHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await supplierService.deleteSupplier(id);
  res.status(204).send();
};
