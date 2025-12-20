export interface CreateScanQRDTO {
    assetId: number;             // required, foreign key
    scanDate: Date;              // required
    scanLocation: string;        // required
    userId: number;              // required, foreign key
}

// DTO for updating an existing ScanQR record
export interface UpdateScanQRDTO {
    assetId?: number;
    scanDate?: Date;
    scanLocation?: string;
    userId?: number;
}