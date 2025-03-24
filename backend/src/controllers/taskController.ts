import { Response } from "express";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { PAGINATION } from "../config/constants";
import { ERROR_MESSAGES } from "../utils/messages";
import { validateDto } from "../utils/validation";
import { TaskService } from "../services/taskService";
import { CreateTaskDto } from "../dtos/creates/createTaskDto";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";
import { RelationsOptionsType } from "../types/RelationsOptions.type";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async getUserTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
      } = req.query;

      const relationsOptions: RelationsOptionsType = {
        category: true,
      };

      const userId = req.userId;
      if (!userId) {
        res
          .status(HttpStatusCodeEnum.BadRequest)
          .send(ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED);
        return;
      }

      const tasks = await this.taskService.getUserTasks(
        Number(page),
        Number(limit),
        userId,
        relationsOptions
      );

      res.status(HttpStatusCodeEnum.Ok).json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCodeEnum.BadRequest).send(error.message);
      } else {
        res
          .status(HttpStatusCodeEnum.InternalServerError)
          .send(ERROR_MESSAGES.TASK.SELECT_TASK_ERROR);
      }
    }
  }

  async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const createTaskDto = Object.assign(new CreateTaskDto(), req.body);
      const userId = req.userId;

      const isValid = await validateDto(createTaskDto, res);
      if (!isValid) {
        return;
      }

      if (!userId) {
        res
          .status(HttpStatusCodeEnum.BadRequest)
          .send(ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED);
        return;
      }

      const savedTask = await this.taskService.createTask(
        userId,
        createTaskDto
      );

      res.status(HttpStatusCodeEnum.Created).json(savedTask);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCodeEnum.BadRequest).send(error.message);
      } else {
        res
          .status(HttpStatusCodeEnum.InternalServerError)
          .send(ERROR_MESSAGES.TASK.CREATE_TASK_ERROR);
      }
    }
  }
}
