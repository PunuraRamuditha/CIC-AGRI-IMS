import { Request, Response, RequestHandler } from "express";
import * as userService from "../services/userService";
import { CreateUserDTO, UpdateUserDTO } from "../dto/userDTO";

// GET all users
export const getAllUsers: RequestHandler = async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

// GET user by ID
export const getUserById: RequestHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await userService.getUserById(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
};

// CREATE user
export const createUser: RequestHandler = async (req: Request, res: Response) => {
  const data: CreateUserDTO = req.body;
  const newUser = await userService.createUser(data);
  res.status(201).json(newUser);
};

// UPDATE user
export const updateUser: RequestHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data: UpdateUserDTO = req.body;
  const updatedUser = await userService.updateUser(id, data);
  res.json(updatedUser);
};

// DELETE user
export const deleteUser: RequestHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await userService.deleteUser(id);
  res.status(204).send();
};

// This endpoint is deprecated - use /api/auth/login instead
export const validateUser: RequestHandler = async (_req: Request, res: Response) => {
  res.status(410).json({ 
    success: false,
    message: "This endpoint is deprecated. Please use /api/auth/login instead." 
  });
};
