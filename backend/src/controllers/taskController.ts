import { Response } from "express";
import { HttpStatusEnum } from "../enums/HttpStatusEnum";
import { PAGINATION } from "../config/constants";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/messages";
import { validateDto } from "../utils/validation";
import { TaskService } from "../services/taskService";
import { CreateTaskDto } from "../dtos/creates/createTaskDto";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";
import { RelationsOptionsType } from "../types/RelationsOptions.type";
import { UpdateTaskDto } from "../dtos/updates/updateTaskDto";
import { UpdateTaskCompletedDateDto } from "../dtos/updates/updateTaskCompletedDateDto";
import { plainToInstance } from "class-transformer";
import { HttpError } from "../utils/httpError";

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
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED);
        return;
      }

      const tasks = await this.taskService.getUserTasks(
        Number(page),
        Number(limit),
        userId,
        relationsOptions
      );

      res.status(HttpStatusEnum.Ok).json(tasks);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.TASK.SELECT_TASK_ERROR);
      }
    }
  }

  async getUserTaskById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const relationsOptions: RelationsOptionsType = {
        category: true,
      };

      const userId = req.userId;
      const { taskId } = req.params;

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED);
        return;
      }

      if (!taskId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.TASK_ID_IS_REQUIRED);
        return;
      }

      const taskIdNumber = Number(taskId);

      if (isNaN(taskIdNumber)) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.INVALID_TASK_ID);
        return;
      }

      const task = await this.taskService.getUserTaskById(
        userId,
        taskIdNumber,
        relationsOptions
      );

      res.status(HttpStatusEnum.Ok).json(task);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.TASK.SELECT_TASK_BY_ID_ERROR);
      }
    }
  }

  async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const createTaskDto = plainToInstance(CreateTaskDto, req.body, {
        excludeExtraneousValues: true,
      });

      const userId = req.userId;

      const isValid = await validateDto(createTaskDto);
      if (!isValid) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.DTO.INVALID_DATA);
        return;
      }

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED);
        return;
      }

      const savedTask = await this.taskService.createTask(
        userId,
        createTaskDto
      );

      res.status(HttpStatusEnum.Created).json(savedTask);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.TASK.CREATE_TASK_ERROR);
      }
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updateTaskDto = plainToInstance(UpdateTaskDto, req.body, {
        excludeExtraneousValues: true,
      });

      const userId = req.userId;
      const { taskId } = req.params;

      const isValid = await validateDto(updateTaskDto);
      if (!isValid) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.DTO.INVALID_DATA);
        return;
      }

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED);
        return;
      }

      if (!taskId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.TASK_ID_IS_REQUIRED);
        return;
      }

      const taskIdNumber = Number(taskId);

      if (isNaN(taskIdNumber)) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.INVALID_TASK_ID);
        return;
      }

      const updatedTask = await this.taskService.updateTask(
        userId,
        taskIdNumber,
        updateTaskDto
      );

      res.status(HttpStatusEnum.Ok).json(updatedTask);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.TASK.UPDATE_TASK_ERROR);
      }
    }
  }

  async updateTaskCompletedDate(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const updateTaskCompletedDateDto = plainToInstance(
        UpdateTaskCompletedDateDto,
        req.body,
        {
          excludeExtraneousValues: true,
        }
      );

      const userId = req.userId;
      const { taskId } = req.params;

      const isValid = await validateDto(updateTaskCompletedDateDto);
      if (!isValid) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.DTO.INVALID_DATA);
        return;
      }

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED);
        return;
      }

      if (!taskId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.TASK_ID_IS_REQUIRED);
        return;
      }

      const taskIdNumber = Number(taskId);

      if (isNaN(taskIdNumber)) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.INVALID_TASK_ID);
        return;
      }

      const updatedTask = await this.taskService.updateTaskCompletedDate(
        userId,
        taskIdNumber,
        updateTaskCompletedDateDto
      );

      res.status(HttpStatusEnum.Ok).json(updatedTask);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.TASK.UPDATE_TASK_COMPLETED_DATE_ERROR);
      }
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const { taskId } = req.params;

      if (!userId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED);
        return;
      }

      if (!taskId) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.TASK_ID_IS_REQUIRED);
        return;
      }

      const taskIdNumber = Number(taskId);

      if (isNaN(taskIdNumber)) {
        res
          .status(HttpStatusEnum.BadRequest)
          .json(ERROR_MESSAGES.TASK.INVALID_TASK_ID);
        return;
      }

      await this.taskService.deleteTask(userId, taskIdNumber);

      res
        .status(HttpStatusEnum.Ok)
        .json(SUCCESS_MESSAGES.TASK.TASK_DELETED_SUCCESSFULLY);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json(error.message);
      } else {
        res
          .status(HttpStatusEnum.InternalServerError)
          .json(ERROR_MESSAGES.TASK.DELETE_TASK_ERROR);
      }
    }
  }
}
