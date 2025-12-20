/*
  # Create Assets Management Tables

  1. New Tables
    - `assets`
      - `id` (uuid, primary key) - Unique identifier for the asset
      - `name` (text, required) - Asset name
      - `asset_code` (text, unique, required) - Unique asset code for QR generation
      - `category` (text, required) - Asset category (equipment, vehicle, property, furniture, technology, other)
      - `status` (text, required) - Asset status (active, inactive, maintenance)
      - `description` (text, optional) - Asset description
      - `company` (text, required) - Company ownership
      - `location` (text, required) - Physical location
      - `assigned_to` (text, optional) - Person or department assigned to
      - `purchase_date` (date, required) - Date of purchase
      - `purchase_price` (numeric, required) - Purchase price
      - `model` (text, optional) - Model information
      - `serial_number` (text, optional) - Serial number
      - `manufacturer` (text, optional) - Manufacturer name
      - `supplier` (text, optional) - Supplier name
      - `specifications` (text, optional) - Technical specifications
      - `warranty` (integer, optional) - Warranty period in months
      - `warranty_expiry` (date, optional) - Warranty expiration date
      - `last_maintenance` (date, optional) - Last maintenance date
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

    - `scan_history`
      - `id` (uuid, primary key) - Unique identifier for the scan
      - `asset_id` (uuid, foreign key) - Reference to assets table
      - `scan_date` (timestamptz, required) - When the scan occurred
      - `scan_location` (text, required) - Location where scan occurred
      - `user_id` (uuid, optional) - User who performed the scan
      - `notes` (text, optional) - Additional scan notes
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read all data
    - Add policies for authenticated users to insert/update their own data
    - Add policies for authenticated users to insert scan history
*/

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  asset_code text UNIQUE NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  description text,
  company text NOT NULL,
  location text NOT NULL,
  assigned_to text,
  purchase_date date NOT NULL,
  purchase_price numeric NOT NULL DEFAULT 0,
  model text,
  serial_number text,
  manufacturer text,
  supplier text,
  specifications text,
  warranty integer,
  warranty_expiry date,
  last_maintenance date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scan history table
CREATE TABLE IF NOT EXISTS scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  scan_date timestamptz NOT NULL DEFAULT now(),
  scan_location text NOT NULL,
  user_id uuid,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create index on asset_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_assets_asset_code ON assets(asset_code);
CREATE INDEX IF NOT EXISTS idx_scan_history_asset_id ON scan_history(asset_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_scan_date ON scan_history(scan_date DESC);

-- Enable Row Level Security
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- Assets policies
CREATE POLICY "Anyone can view assets"
  ON assets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete assets"
  ON assets FOR DELETE
  TO authenticated
  USING (true);

-- Scan history policies
CREATE POLICY "Authenticated users can view scan history"
  ON scan_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert scan history"
  ON scan_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();