import { supabase } from '../lib/supabase';

export interface AssetData {
  id: string;
  name: string;
  asset_code: string;
  category: string;
  status: string;
  description?: string;
  company: string;
  location: string;
  assigned_to?: string;
  purchase_date: string;
  purchase_price: number;
  model?: string;
  serial_number?: string;
  manufacturer?: string;
  supplier?: string;
  specifications?: string;
  warranty?: number;
  warranty_expiry?: string;
  last_maintenance?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScanHistoryData {
  id?: string;
  asset_id: string;
  scan_date: string;
  scan_location: string;
  user_id?: string;
  notes?: string;
}

export const getAssetByCode = async (assetCode: string): Promise<AssetData | null> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('asset_code', assetCode)
      .maybeSingle();

    if (error) {
      console.error('Error fetching asset by code:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAssetByCode:', error);
    return null;
  }
};

export const getAssetById = async (assetId: string): Promise<AssetData | null> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching asset by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAssetById:', error);
    return null;
  }
};

export const getAllAssets = async (): Promise<AssetData[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all assets:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllAssets:', error);
    return [];
  }
};

export const createScanHistory = async (scanData: Omit<ScanHistoryData, 'id'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scan_history')
      .insert([scanData]);

    if (error) {
      console.error('Error creating scan history:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createScanHistory:', error);
    return false;
  }
};

export const getScanHistoryByAsset = async (assetId: string): Promise<ScanHistoryData[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .eq('asset_id', assetId)
      .order('scan_date', { ascending: false });

    if (error) {
      console.error('Error fetching scan history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getScanHistoryByAsset:', error);
    return [];
  }
};
