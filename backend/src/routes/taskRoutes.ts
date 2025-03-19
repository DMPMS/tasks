import { Router } from "express";
import { TaskService } from "../services/taskService";
import { TaskController } from "../controllers/taskController";
import { authMiddleware } from "../middlewares/authMiddleware";

const taskRoutes = Router();

const taskService = new TaskService();
const taskController = new TaskController(taskService);

taskRoutes.get("/task", authMiddleware, (req, res) =>
  taskController.getUserTasks(req, res)
);

taskRoutes.post("/task", authMiddleware, (req, res) =>
  taskController.createTask(req, res)
);

export default taskRoutes;
