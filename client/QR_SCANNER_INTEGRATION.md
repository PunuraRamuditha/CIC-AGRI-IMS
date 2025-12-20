# QR Scanner Integration with Supabase

This document explains how the QR Scanner Panel integrates with Supabase to fetch asset data when scanning QR codes.

## Overview

When you scan a QR code containing an asset code, the system:
1. Extracts the asset code from the QR data
2. Queries the Supabase database for the asset details
3. Displays the complete asset information
4. Records the scan in the scan history table

## Database Schema

### Assets Table
- `id` (uuid) - Primary key
- `name` (text) - Asset name
- `asset_code` (text, unique) - Unique code for QR generation
- `category` (text) - Asset category
- `status` (text) - Current status
- `location` (text) - Physical location
- And many more fields...

### Scan History Table
- `id` (uuid) - Primary key
- `asset_id` (uuid) - Foreign key to assets table
- `scan_date` (timestamptz) - When the scan occurred
- `scan_location` (text) - Where the scan occurred
- `user_id` (uuid) - Who performed the scan
- `notes` (text) - Additional notes

## How It Works

### 1. QR Code Generation
Assets generate QR codes containing JSON data:
```json
{
  "assetCode": "LAPTOP001",
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

### 2. QR Code Scanning
When you scan a QR code:
- The scanner extracts the asset code from the QR data
- It queries Supabase: `SELECT * FROM assets WHERE asset_code = 'LAPTOP001'`
- If found, it displays asset information
- It creates a scan history record

### 3. Asset Information Display
Once the asset is found, the scanner shows:
- Asset name
- Category
- Status
- Location
- Serial number
- Assigned user
- And more...

## Sample Data

The database has been populated with sample assets:

1. **LAPTOP001** - Dell Latitude 5520 Laptop
   - Category: technology
   - Location: head_office
   - Status: active

2. **PRINTER001** - HP LaserJet Pro M404n
   - Category: equipment
   - Location: head_office
   - Status: active

3. **VEHICLE001** - Toyota Corolla
   - Category: vehicle
   - Location: branch_a
   - Status: active

## Testing

To test the QR scanner:
1. Navigate to the QR Scanner Panel in the dashboard
2. Generate a test QR code with asset code "LAPTOP001"
3. Scan the QR code
4. The system will fetch and display the Dell Latitude laptop details
5. Check the scan_history table to see the recorded scan

## API Functions

### `getAssetByCode(assetCode: string)`
Fetches asset data from Supabase by asset code.

### `createScanHistory(scanData)`
Records a scan event in the scan_history table.

### `getAssetById(assetId: string)`
Fetches asset data by UUID.

### `getAllAssets()`
Retrieves all assets from the database.

### `getScanHistoryByAsset(assetId: string)`
Gets scan history for a specific asset.

## Error Handling

The system gracefully handles:
- QR codes without valid asset codes
- Assets not found in database
- Network errors
- Invalid QR code formats

## Security

All database operations are protected by Row Level Security (RLS):
- Authenticated users can view all assets
- Authenticated users can create scan records
- Authenticated users can update assets
