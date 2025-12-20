import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import assetRoutes from "./routes/assetRoutes";
import userRoutes from "./routes/userRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import scanQRRoutes from "./routes/scanQRRoutes";
import authRoutes from "./routes/authRoutes";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/scans", scanQRRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
