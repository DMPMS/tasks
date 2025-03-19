import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { PAGINATION } from "../config/constants";
import { ERROR_MESSAGES } from "../utils/messages";
import { validateDto } from "../utils/validation";
import { TaskService } from "../services/taskService";
import { CreateTaskDto } from "../dtos/creates/createTaskDto";
import { RelationsOptionsType } from "../types/RelationsOptions.type";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
      } = req.query;

      const relationsOptions: RelationsOptionsType = {
        user: true,
      };

      const returnTasksDto = await this.taskService.getTasks(
        Number(page),
        Number(limit),
        relationsOptions
      );

      res.status(HttpStatusCodeEnum.OK).json(returnTasksDto);
    } catch (error) {
      res
        .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
        .send(ERROR_MESSAGES.TASK.SELECT_TASK_ERROR);
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const createTaskDto = Object.assign(new CreateTaskDto(), req.body);

      const isValid = await validateDto(createTaskDto, res);
      if (!isValid) {
        return;
      }

      const returnTaskDto = await this.taskService.createTask(createTaskDto);

      res.status(HttpStatusCodeEnum.CREATED).json(returnTaskDto);
    } catch (error) {
      res
        .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
        .send(ERROR_MESSAGES.TASK.CREATE_TASK_ERROR);
    }
  }
}
