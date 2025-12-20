import { Router } from "express";
import * as scanQRController from "../controllers/scanQRController";

const router = Router();

// GET all scanQRs
router.get("/", scanQRController.getAllScanQRs);

// GET a single scanQR by ID
router.get("/:id", scanQRController.getScanQRById);

// CREATE a new scanQR
router.post("/", scanQRController.createScanQR);

// UPDATE an existing scanQR
router.put("/:id", scanQRController.updateScanQR);

// DELETE a scanQR
router.delete("/:id", scanQRController.deleteScanQR);

export default router;