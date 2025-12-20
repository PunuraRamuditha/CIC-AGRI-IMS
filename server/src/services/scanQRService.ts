import prisma from "../config/prisma";
import { ScanQR } from "../model/scanQR";

// Get all ScanQR records
export const getAllScanQRs = async (): Promise<ScanQR[]> => {
    return await prisma.scanQR.findMany();
};

// Get ScanQR by ID
export const getScanQRById = async (id: number): Promise<ScanQR | null> => {
    return await prisma.scanQR.findUnique({ where: { id } });
};

// Create new ScanQR record
export const createScanQR = async (data: Omit<ScanQR, "id">): Promise<ScanQR> => {
    return await prisma.scanQR.create({ data });
};

// Update ScanQR record
export const updateScanQR = async (id: number, data: Partial<Omit<ScanQR, "id">>): Promise<ScanQR> => {
    return await prisma.scanQR.update({
        where: { id },
        data,
    });
};

// Delete ScanQR record
export const deleteScanQR = async (id: number): Promise<ScanQR> => {
    return await prisma.scanQR.delete({ where: { id } });
};