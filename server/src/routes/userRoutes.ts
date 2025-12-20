import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticateToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

// Protected routes - require authentication
router.get("/", authenticateToken, authorizeRoles('admin', 'manager' , 'superadmin'), userController.getAllUsers);
router.get("/:id", authenticateToken, authorizeRoles('admin', 'manager' , 'superadmin'), userController.getUserById);
router.post("/", authenticateToken, authorizeRoles('admin' , 'superadmin'), userController.createUser);
router.put("/:id", authenticateToken, authorizeRoles('admin' , 'superadmin'), userController.updateUser);
router.delete("/:id", authenticateToken, authorizeRoles('admin' , 'superadmin'), userController.deleteUser);

// Deprecated login route - redirect to new auth system
router.post("/auth/login", userController.validateUser);

export default router;
