import { DeleteResult, Repository } from "typeorm";
import { AppDataSource } from "../config/orm";
import { TaskEntity } from "../entities/taskEntity";
import { ReturnTaskDto } from "../dtos/returns/returnTaskDto";
import { CreateTaskDto } from "../dtos/creates/createTaskDto";
import { RelationsOptionsType } from "../types/RelationsOptions.type";
import { UserService } from "./userService";
import { CategoryService } from "./categoryService";
import { ERROR_MESSAGES } from "../utils/messages";

export class TaskService {
  private readonly userService: UserService;
  private readonly categoryService: CategoryService;

  constructor(
    private readonly taskRepository: Repository<TaskEntity> = AppDataSource.getRepository(
      TaskEntity
    )
  ) {
    this.userService = new UserService();
    this.categoryService = new CategoryService();
  }

  async getUserTasks(
    page: number,
    limit: number,
    userId: number,
    relationsOptions?: RelationsOptionsType
  ): Promise<ReturnTaskDto[]> {
    await this.userService.getUserById(userId);

    const skip = (page - 1) * limit;

    const tasks = await this.taskRepository.find({
      // skip,
      // take: limit,
      where: { userId: userId },
      relations: relationsOptions,
    });

    return tasks.map((task) => new ReturnTaskDto(task));
  }

  async getUserTaskById(
    userId: number,
    taskId: number,
    relationsOptions?: RelationsOptionsType
  ): Promise<ReturnTaskDto> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId: userId },
      relations: relationsOptions,
    });

    if (!task) {
      throw new Error(ERROR_MESSAGES.TASK.TASK_ID_NOT_FOUND(taskId, userId));
    }

    return new ReturnTaskDto(task);
  }

  async createTask(
    userId: number,
    createTaskDto: CreateTaskDto
  ): Promise<ReturnTaskDto> {
    await this.userService.getUserById(userId);

    if (createTaskDto.categoryId) {
      await this.categoryService.getUserCategoryById(
        userId,
        createTaskDto.categoryId
      );
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      userId: userId,
      categoryId: createTaskDto.categoryId
        ? createTaskDto.categoryId
        : undefined,
      completedDate: undefined,
    });

    const savedTask = await this.taskRepository.save(task);

    return new ReturnTaskDto(savedTask);
  }

  async deleteTask(userId: number, taskId: number): Promise<DeleteResult> {
    await this.getUserTaskById(userId, taskId);

    return this.taskRepository.delete({ id: taskId });
  }
}
