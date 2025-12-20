import prisma from "../config/prisma";
import { Asset } from "../model/asset";
import { CreateAssetDTO, UpdateAssetDTO } from "../dto/assetDTO";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Custom error types
export class AssetNotFoundError extends Error {
  constructor(identifier: string | number) {
    super(`Asset not found: ${identifier}`);
    this.name = "AssetNotFoundError";
  }
}

export class DuplicateAssetCodeError extends Error {
  constructor(code: string) {
    super(`Asset code already exists: ${code}`);
    this.name = "DuplicateAssetCodeError";
  }
}

// Get all assets with optional filtering
export const getAllAssets = async (filters?: {
  categoryId?: number;
  statusId?: number;
  companyId?: number;
}): Promise<Asset[]> => {
  try {
    // Build the where clause conditionally
    const whereClause: any = {};
    
    if (filters?.categoryId !== undefined) {
      whereClause.categoryId = filters.categoryId;
    }
    if (filters?.statusId !== undefined) {
      whereClause.statusId = filters.statusId;
    }
    if (filters?.companyId !== undefined) {
      whereClause.companyId = filters.companyId;
    }

    return await prisma.asset.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    throw new Error(`Failed to fetch assets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get asset by ID
export const getAssetById = async (id: number): Promise<Asset> => {
  try {
    const asset = await prisma.asset.findUnique({ where: { id } });
    
    if (!asset) {
      throw new AssetNotFoundError(id);
    }
    
    return asset;
  } catch (error) {
    if (error instanceof AssetNotFoundError) throw error;
    throw new Error(`Failed to fetch asset by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get asset by code
export const getAssetByCode = async (code: string): Promise<Asset> => {
  try {
    const asset = await prisma.asset.findUnique({ 
      where: { assetCode: code } 
    });
    
    if (!asset) {
      throw new AssetNotFoundError(code);
    }
    
    return asset;
  } catch (error) {
    if (error instanceof AssetNotFoundError) throw error;
    throw new Error(`Failed to fetch asset by code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Check if asset code exists
export const assetCodeExists = async (code: string, excludeId?: number): Promise<boolean> => {
  const asset = await prisma.asset.findUnique({
    where: { assetCode: code },
    select: { id: true },
  });
  
  if (!asset) return false;
  if (excludeId && asset.id === excludeId) return false;
  
  return true;
};

// Create new asset
export const createAsset = async (data: CreateAssetDTO): Promise<Asset> => {
  try {
    // Check for duplicate asset code
    if (await assetCodeExists(data.assetCode)) {
      throw new DuplicateAssetCodeError(data.assetCode);
    }
    
    return await prisma.asset.create({ data });
  } catch (error) {
    if (error instanceof DuplicateAssetCodeError) throw error;
    
    // Handle Prisma unique constraint violation
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new DuplicateAssetCodeError(data.assetCode);
      }
      if (error.code === 'P2003') {
        throw new Error('Foreign key constraint failed. Please verify related records exist.');
      }
    }
    
    throw new Error(`Failed to create asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Update asset
export const updateAsset = async (id: number, data: UpdateAssetDTO): Promise<Asset> => {
  try {
    // Check if asset exists
    await getAssetById(id);
    
    // If updating asset code, check for duplicates
    if (data.assetCode && await assetCodeExists(data.assetCode, id)) {
      throw new DuplicateAssetCodeError(data.assetCode);
    }
    
    return await prisma.asset.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error instanceof AssetNotFoundError || error instanceof DuplicateAssetCodeError) {
      throw error;
    }
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new AssetNotFoundError(id);
      }
      if (error.code === 'P2003') {
        throw new Error('Foreign key constraint failed. Please verify related records exist.');
      }
    }
    
    throw new Error(`Failed to update asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Delete asset
export const deleteAsset = async (id: number): Promise<Asset> => {
  try {
    return await prisma.asset.delete({ where: { id } });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new AssetNotFoundError(id);
      }
      if (error.code === 'P2003') {
        throw new Error('Cannot delete asset: related records exist.');
      }
    }
    
    throw new Error(`Failed to delete asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Soft delete (if you have a deletedAt field)
export const softDeleteAsset = async (id: number): Promise<Asset> => {
  try {
    return await prisma.asset.update({
      where: { id },
      data: { purchaseDate: new Date() },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AssetNotFoundError(id);
    }
    throw new Error(`Failed to soft delete asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};