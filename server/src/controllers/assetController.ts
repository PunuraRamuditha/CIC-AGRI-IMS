import { Request, Response, RequestHandler } from "express";
import * as assetService from "../services/assetService";
import { CreateAssetDTO, UpdateAssetDTO } from "../dto/assetDTO";

// GET all assets
export const getAllAssets: RequestHandler = async (_req: Request, res: Response) => {
  const assets = await assetService.getAllAssets();
  res.json(assets);
};

// GET asset by ID
export const getAssetById: RequestHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const asset = await assetService.getAssetById(id);
  if (!asset) {
    res.status(404).json({ message: "Asset not found" });
    return;
  }
  res.json(asset);
};

export const getAssetByCode: RequestHandler = async (req: Request, res: Response) => {
  const code = req.params.code;
  const asset = await assetService.getAssetByCode(code);
  if (!asset) {
    res.status(404).json({ message: "Asset not found" });
    return;
  }
  res.json(asset);
};

// CREATE asset
export const createAsset: RequestHandler = async (req: Request, res: Response) => {
  const data: CreateAssetDTO = req.body;
  const newAsset = await assetService.createAsset(data);
  res.status(201).json(newAsset);
};

// UPDATE asset
export const updateAsset: RequestHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data: UpdateAssetDTO = req.body;
  const updated = await assetService.updateAsset(id, data);
  res.json(updated);
};

// DELETE asset
export const deleteAsset: RequestHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await assetService.deleteAsset(id);
  res.status(204).send();
};
