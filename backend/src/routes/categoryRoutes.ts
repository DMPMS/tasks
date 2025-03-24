import { Router } from "express";
import { CategoryService } from "../services/categoryService";
import { CategoryController } from "../controllers/categoryController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserTypeEnum } from "../enums/UserTypeEnum";

const categoryRoutes = Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

categoryRoutes.get(
  "/category",
  authMiddleware,
  roleMiddleware([UserTypeEnum.User]),
  (req, res) => categoryController.getUserCategories(req, res)
);

categoryRoutes.post(
  "/category",
  authMiddleware,
  roleMiddleware([UserTypeEnum.User]),
  (req, res) => categoryController.createCategory(req, res)
);

export default categoryRoutes;
