import { Repository } from "typeorm";
import { AppDataSource } from "../config/orm";
import { TaskEntity } from "../entities/taskEntity";
import { ReturnTaskDto } from "../dtos/returns/returnTaskDto";
import { CreateTaskDto } from "../dtos/creates/createTaskDto";
import { RelationsOptionsType } from "../types/RelationsOptions.type";
import { UserService } from "./userService";

export class TaskService {
  private readonly userService: UserService;

  constructor(
    private readonly taskRepository: Repository<TaskEntity> = AppDataSource.getRepository(
      TaskEntity
    )
  ) {
    this.userService = new UserService();
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
      skip,
      take: limit,
      where: { userId: userId },
      relations: relationsOptions,
    });

    return tasks.map((task) => new ReturnTaskDto(task));
  }

  async createTask(
    userId: number,
    createTaskDto: CreateTaskDto
  ): Promise<ReturnTaskDto> {
    await this.userService.getUserById(userId);

    const task = this.taskRepository.create({
      ...createTaskDto,
      userId: userId,
      completed: false,
    });

    const savedTask = await this.taskRepository.save(task);

    return new ReturnTaskDto(savedTask);
  }
}
