# SQL Server Backend Setup for QR Scanner

This document explains how to set up your SQL Server database and backend API to support QR code scanning with asset lookup.

## Database Schema

Your SQL Server database should have the following tables:

### Assets Table

```sql
CREATE TABLE Assets (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    assetCode NVARCHAR(50) UNIQUE NOT NULL,
    category NVARCHAR(50) NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'active',
    description NVARCHAR(MAX),
    company NVARCHAR(100) NOT NULL,
    location NVARCHAR(100) NOT NULL,
    assignedTo NVARCHAR(100),
    purchaseDate DATE NOT NULL,
    purchasePrice DECIMAL(18,2) NOT NULL DEFAULT 0,
    model NVARCHAR(100),
    serialNumber NVARCHAR(100),
    manufacturer NVARCHAR(100),
    supplier NVARCHAR(100),
    specifications NVARCHAR(MAX),
    warranty INT,
    warrantyExpiry DATE,
    lastMaintenance DATE,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create index for fast lookups by asset code
CREATE INDEX idx_assets_assetCode ON Assets(assetCode);
```

### ScanQR Table

```sql
CREATE TABLE ScanQR (
    id INT PRIMARY KEY IDENTITY(1,1),
    assetId INT FOREIGN KEY REFERENCES Assets(id),
    scanDate DATETIME NOT NULL DEFAULT GETDATE(),
    scanLocation NVARCHAR(100) NOT NULL,
    userId INT,
    createdAt DATETIME DEFAULT GETDATE()
);

-- Create index for scan history queries
CREATE INDEX idx_scanqr_assetId ON ScanQR(assetId);
CREATE INDEX idx_scanqr_scanDate ON ScanQR(scanDate DESC);
```

## Backend API Endpoints

You need to add the following endpoint to your Node.js/Express backend:

### Get Asset by Code Endpoint

```javascript
// GET /api/assets/code/:assetCode
app.get('/api/assets/code/:assetCode', async (req, res) => {
  try {
    const { assetCode } = req.params;

    // Query SQL Server using your preferred library (mssql, tedious, etc.)
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('assetCode', sql.NVarChar, assetCode)
      .query('SELECT * FROM Assets WHERE assetCode = @assetCode');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching asset by code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Create Scan Record Endpoint (if not exists)

```javascript
// POST /api/scans
app.post('/api/scans', async (req, res) => {
  try {
    const { assetId, scanDate, scanLocation, userId } = req.body;

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('assetId', sql.Int, assetId)
      .input('scanDate', sql.DateTime, scanDate)
      .input('scanLocation', sql.NVarChar, scanLocation)
      .input('userId', sql.Int, userId)
      .query(`
        INSERT INTO ScanQR (assetId, scanDate, scanLocation, userId)
        OUTPUT INSERTED.*
        VALUES (@assetId, @scanDate, @scanLocation, @userId)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating scan record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Sample Data

Insert some test data into your SQL Server database:

```sql
INSERT INTO Assets (name, assetCode, category, status, company, location, purchaseDate, purchasePrice, serialNumber, manufacturer)
VALUES
('Dell Latitude 5520 Laptop', 'LAPTOP001', 'technology', 'active', 'cic_holdings', 'head_office', '2024-01-15', 1200.00, 'DL5520-ABC123', 'Dell'),
('HP LaserJet Pro M404n', 'PRINTER001', 'equipment', 'active', 'cic_holdings', 'head_office', '2024-02-10', 450.00, 'HP-M404N-XYZ789', 'HP'),
('Toyota Corolla', 'VEHICLE001', 'vehicle', 'active', 'cic_agri', 'branch_a', '2023-06-20', 25000.00, 'TC2023-456789', 'Toyota');
```

## Frontend Integration

The frontend is already configured to work with your SQL Server backend:

1. **API Base URL**: `http://localhost:5000/api` (configured in `src/api/api.ts`)
2. **Get Asset by Code**: `GET /api/assets/code/:assetCode`
3. **Create Scan**: `POST /api/scans`

## How It Works

1. User scans a QR code containing an asset code (e.g., "LAPTOP001")
2. Frontend extracts the asset code from the QR data
3. Frontend calls `GET /api/assets/code/LAPTOP001`
4. Backend queries SQL Server and returns asset data
5. Frontend displays the asset information
6. Frontend calls `POST /api/scans` to record the scan event
7. Backend inserts the scan record into SQL Server

## Testing

1. Start your backend server: `npm start` (or your backend start command)
2. Make sure it's running on `http://localhost:5000`
3. Start the frontend: `npm run dev`
4. Navigate to the QR Scanner Panel
5. Scan a QR code with asset code "LAPTOP001"
6. The system should fetch and display the laptop details

## Troubleshooting

### Asset Not Found
- Check if the asset exists in the database
- Verify the asset code matches exactly (case-sensitive)
- Check backend logs for SQL errors

### Backend Connection Error
- Ensure backend is running on port 5000
- Check SQL Server connection string
- Verify firewall settings

### CORS Issues
- Add CORS middleware to your backend:
```javascript
const cors = require('cors');
app.use(cors());
```

## Database Connection Example (Node.js)

```javascript
const sql = require('mssql');

const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'localhost',
  database: 'your_database',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Connect to database
sql.connect(config).then(pool => {
  console.log('Connected to SQL Server');
}).catch(err => {
  console.error('Database connection failed:', err);
});
```
