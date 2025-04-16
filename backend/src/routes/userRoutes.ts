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

userRoutes.get("/user/info", authMiddleware, (req, res) =>
  userController.getUserInfo(req, res)
);

userRoutes.post("/user", (req, res) => userController.createUser(req, res));

userRoutes.post(
  "/user/admin",
  authMiddleware,
  roleMiddleware([UserTypeEnum.Root]),
  (req, res) => userController.createAdmin(req, res)
);

userRoutes.put("/user/update", authMiddleware, (req, res) =>
  userController.updateUser(req, res)
);

userRoutes.delete(
  "/user",
  authMiddleware,
  roleMiddleware([UserTypeEnum.User, UserTypeEnum.Admin]),
  (req, res) => userController.deleteUserMy(req, res)
);

userRoutes.delete(
  "/user/:userDeleteId",
  authMiddleware,
  roleMiddleware([UserTypeEnum.Admin]),
  (req, res) => userController.deleteUser(req, res)
);

userRoutes.delete(
  "/user/admin/:adminDeleteId",
  authMiddleware,
  roleMiddleware([UserTypeEnum.Root]),
  (req, res) => userController.deleteAdmin(req, res)
);

export default userRoutes;
