import { Router } from "express";
import { TaskService } from "../services/taskService";
import { TaskController } from "../controllers/taskController";

const taskRoutes = Router();

const taskService = new TaskService();
const taskController = new TaskController(taskService);

taskRoutes.get("/task", (req, res) => taskController.getTasks(req, res));

taskRoutes.post("/task", (req, res) => taskController.createTask(req, res));

export default taskRoutes;
