import { Request, Response, RequestHandler } from "express";
import * as scanQRService from "../services/scanQRService";
import { CreateScanQRDTO, UpdateScanQRDTO } from "../dto/scanDTO";

// GET all scanQR records
export const getAllScanQRs: RequestHandler = async (_req: Request, res: Response) => {
    const scanQRs = await scanQRService.getAllScanQRs();
    res.json(scanQRs);
};

// GET scanQR by ID
export const getScanQRById: RequestHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const scanQR = await scanQRService.getScanQRById(id);
    if (!scanQR) {
        res.status(404).json({ message: "ScanQR record not found" });
        return;
    }
    res.json(scanQR);
};

// CREATE scanQR
export const createScanQR: RequestHandler = async (req: Request, res: Response) => {
    const data: CreateScanQRDTO = req.body;
    const newScanQR = await scanQRService.createScanQR(data);
    res.status(201).json(newScanQR);
};

// UPDATE scanQR
export const updateScanQR: RequestHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const data: UpdateScanQRDTO = req.body;
    const updatedScanQR = await scanQRService.updateScanQR(id, data);
    if (!updatedScanQR) {
        res.status(404).json({ message: "ScanQR record not found" });
        return;
    }
    res.json(updatedScanQR);
};

// DELETE scanQR
export const deleteScanQR: RequestHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const deleted = await scanQRService.deleteScanQR(id);
    if (!deleted) {
        res.status(404).json({ message: "ScanQR record not found" });
        return;
    }
    res.status(204).send();
};