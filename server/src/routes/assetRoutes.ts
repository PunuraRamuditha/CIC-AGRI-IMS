import { Router } from "express";
import * as assetController from "../controllers/assetController";

const router = Router();

router.get("/", assetController.getAllAssets);
router.get("/:id", assetController.getAssetById);
router.post("/", assetController.createAsset);
router.put("/:id", assetController.updateAsset);
router.delete("/:id", assetController.deleteAsset);

router.get("/code/:code", assetController.getAssetByCode);

export default router;
