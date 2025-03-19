import { Repository } from "typeorm";
import { AppDataSource } from "../config/orm";
import { TaskEntity } from "../entities/taskEntity";
import { ReturnTaskDto } from "../dtos/returns/returnTaskDto";
import { CreateTaskDto } from "../dtos/creates/createTaskDto";
import { RelationsOptionsType } from "../types/RelationsOptions.type";

export class TaskService {
  constructor(
    private readonly taskRepository: Repository<TaskEntity> = AppDataSource.getRepository(
      TaskEntity
    )
  ) {}

  async getTasks(
    page: number,
    limit: number,
    relationsOptions?: RelationsOptionsType
  ): Promise<ReturnTaskDto[]> {
    const skip = (page - 1) * limit;

    const tasks = await this.taskRepository.find({
      skip,
      take: limit,
      relations: relationsOptions,
    });

    return tasks.map((task) => new ReturnTaskDto(task));
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<ReturnTaskDto> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      completed: false,
    });

    const savedTask = await this.taskRepository.save(task);

    return new ReturnTaskDto(savedTask);
  }
}
