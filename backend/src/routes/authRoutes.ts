import { Router } from "express";
import { AuthService } from "../services/authService";
import { AuthController } from "../controllers/authController";

const authRoutes = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

authRoutes.post("/auth", (req, res) => authController.login(req, res));

export default authRoutes;
