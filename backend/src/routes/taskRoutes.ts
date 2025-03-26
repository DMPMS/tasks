import { Router } from "express";
import { TaskService } from "../services/taskService";
import { TaskController } from "../controllers/taskController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserTypeEnum } from "../enums/UserTypeEnum";

const taskRoutes = Router();

const taskService = new TaskService();
const taskController = new TaskController(taskService);

taskRoutes.get(
  "/task",
  authMiddleware,
  roleMiddleware([UserTypeEnum.User]),
  (req, res) => taskController.getUserTasks(req, res)
);

taskRoutes.get(
  "/task/:taskId",
  authMiddleware,
  roleMiddleware([UserTypeEnum.User]),
  (req, res) => taskController.getUserTaskById(req, res)
);

taskRoutes.post(
  "/task",
  authMiddleware,
  roleMiddleware([UserTypeEnum.User]),
  (req, res) => taskController.createTask(req, res)
);

taskRoutes.put(
  "/task/:taskId",
  authMiddleware,
  roleMiddleware([UserTypeEnum.User]),
  (req, res) => taskController.updateTask(req, res)
);

taskRoutes.patch(
  "/task/:taskId/completedDate",
  authMiddleware,
  roleMiddleware([UserTypeEnum.User]),
  (req, res) => taskController.updateTaskCompletedDate(req, res)
);

taskRoutes.delete(
  "/task/:taskId",
  authMiddleware,
  roleMiddleware([UserTypeEnum.User]),
  (req, res) => taskController.deleteTask(req, res)
);

export default taskRoutes;
