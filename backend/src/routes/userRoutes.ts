import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";

const userRoutes = Router();

const userService = new UserService();
const userController = new UserController(userService);

userRoutes.get("/user", (req, res) => userController.getUsers(req, res));

userRoutes.post("/user", (req, res) => userController.createUser(req, res));

export default userRoutes;
