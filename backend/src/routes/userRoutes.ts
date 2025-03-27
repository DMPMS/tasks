import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserTypeEnum } from "../enums/UserTypeEnum";

const userRoutes = Router();

const userService = new UserService();
const userController = new UserController(userService);

userRoutes.get(
  "/user",
  authMiddleware,
  roleMiddleware([UserTypeEnum.Admin]),
  (req, res) => userController.getUsers(req, res)
);

userRoutes.post("/user", (req, res) => userController.createUser(req, res));

userRoutes.post(
  "/user/admin",
  authMiddleware,
  roleMiddleware([UserTypeEnum.Root]),
  (req, res) => userController.createAdmin(req, res)
);

userRoutes.delete(
  "/user/:userDeleteId",
  authMiddleware,
  roleMiddleware([UserTypeEnum.Admin]),
  (req, res) => userController.deleteUser(req, res)
);

export default userRoutes;
