import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { PAGINATION } from "../config/constants";
import { ERROR_MESSAGES } from "../utils/messages";
import { validateDto } from "../utils/validation";
import { TaskService } from "../services/taskService";
import { CreateTaskDto } from "../dtos/creates/createTaskDto";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async getUserTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
      } = req.query;

      const userId = req.userId;
      if (!userId) {
        res
          .status(HttpStatusCodeEnum.BAD_REQUEST)
          .send(ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED);
        return;
      }

      const returnTasksDto = await this.taskService.getUserTasks(
        Number(page),
        Number(limit),
        userId
      );

      res.status(HttpStatusCodeEnum.OK).json(returnTasksDto);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCodeEnum.BAD_REQUEST).send(error.message);
      } else {
        res
          .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
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
          .status(HttpStatusCodeEnum.BAD_REQUEST)
          .send(ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED);
        return;
      }

      const returnTaskDto = await this.taskService.createTask(
        userId,
        createTaskDto
      );

      res.status(HttpStatusCodeEnum.CREATED).json(returnTaskDto);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCodeEnum.BAD_REQUEST).send(error.message);
      } else {
        res
          .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
          .send(ERROR_MESSAGES.TASK.CREATE_TASK_ERROR);
      }
    }
  }
}
