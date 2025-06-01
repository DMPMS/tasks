import { Repository } from "typeorm";
import { TaskService } from "../../services/taskService";
import { UserService } from "../../services/userService";
import { TaskEntity } from "../../entities/taskEntity";
import {
  MOCK_CREATES,
  MOCK_DATABASE_CREATES,
  MOCK_DATABASE_RETURNS,
  MOCK_DEFAULTS,
  MOCK_DELETE_RESULT,
  MOCK_RETURNS,
  MOCK_UPDATES,
} from "../mocks";
import { PAGINATION } from "../../config/constants";
import { ReturnTaskDto } from "../../dtos/returns/returnTaskDto";
import { ERROR_MESSAGES } from "../../utils/messages";
import { CategoryService } from "../../services/categoryService";
import { UpdateTaskCompletedDateDto } from "../../dtos/updates/updateTaskCompletedDateDto";

describe("TaskService", () => {
  let taskService: TaskService;
  let userServiceMock: jest.Mocked<UserService>;
  let categoryServiceMock: jest.Mocked<CategoryService>;
  let taskRepositoryMock: jest.Mocked<Repository<TaskEntity>>;

  beforeEach(() => {
    taskRepositoryMock = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<TaskEntity>>;

    userServiceMock = {
      getUserById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    categoryServiceMock = {
      getUserCategoryById: jest.fn(),
    } as unknown as jest.Mocked<CategoryService>;

    taskService = new TaskService(taskRepositoryMock);
    // @ts-ignore
    taskService.userService = userServiceMock;
    // @ts-ignore
    taskService.categoryService = categoryServiceMock;
  });

  it("Should instantiate TaskService without args", () => {
    const service = new TaskService();

    expect(service).toBeInstanceOf(TaskService);
  });

  it("getUserTasks - Should return ReturnTaskDto[] on get user tasks successfully", async () => {
    const page = MOCK_DEFAULTS.PAGE;
    const limit = MOCK_DEFAULTS.LIMIT;
    const userId = MOCK_DEFAULTS.USER_ID;
    const relationsOptions = {};

    const skip = (page - PAGINATION.INITIAL_PAGE) * limit;

    const tasks = MOCK_DATABASE_RETURNS.TASKS(userId);

    taskRepositoryMock.find.mockResolvedValue(tasks);

    const result = await taskService.getUserTasks(
      page,
      limit,
      userId,
      relationsOptions
    );

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(taskRepositoryMock.find).toHaveBeenCalledWith({
      // skip,
      // take: limit,
      where: { userId: userId },
      order: { priority: "DESC", limitDate: "ASC", id: "DESC" },
      relations: relationsOptions,
    });
    expect(Array.isArray(result)).toBe(true);
    result.forEach((item) => expect(item).toBeInstanceOf(ReturnTaskDto));
    expect(result).toEqual(tasks.map((task) => new ReturnTaskDto(task)));
  });

  it("getUserTaskById - Should return ReturnTaskDto on get user task by id successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const taskId = MOCK_DEFAULTS.TASK_ID;
    const relationsOptions = {};

    const task = MOCK_DATABASE_RETURNS.TASK(taskId, userId);

    taskRepositoryMock.findOne.mockResolvedValue(task);

    const result = await taskService.getUserTaskById(
      userId,
      taskId,
      relationsOptions
    );

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: taskId, userId: userId },
      relations: relationsOptions,
    });
    expect(result).toBeInstanceOf(ReturnTaskDto);
    expect(result).toEqual(new ReturnTaskDto(task));
  });

  it("getUserTaskById - Should return an error if the task is not found", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const taskId = MOCK_DEFAULTS.TASK_ID;
    const relationsOptions = {};

    const task = null;

    taskRepositoryMock.findOne.mockResolvedValue(task);

    await expect(
      taskService.getUserTaskById(userId, taskId, relationsOptions)
    ).rejects.toThrow(ERROR_MESSAGES.TASK.TASK_ID_NOT_FOUND(taskId, userId));
  });

  it("createTask - Should return ReturnTaskDto on create task successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const createTaskDto = MOCK_CREATES.TASK;

    const savedTask = MOCK_DATABASE_CREATES.TASK(
      createTaskDto,
      MOCK_DEFAULTS.TASK_ID,
      userId
    );

    taskRepositoryMock.save.mockResolvedValue(savedTask);

    const result = await taskService.createTask(userId, createTaskDto);

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);

    if (createTaskDto.categoryId) {
      expect(categoryServiceMock.getUserCategoryById).toHaveBeenCalledWith(
        userId,
        createTaskDto.categoryId
      );
    }

    expect(taskRepositoryMock.save).toHaveBeenCalledWith({
      ...createTaskDto,
      userId: userId,
      categoryId: createTaskDto.categoryId ? createTaskDto.categoryId : null,
      description: createTaskDto.description ? createTaskDto.description : null,
      completedDate: null,
    });
    expect(result).toBeInstanceOf(ReturnTaskDto);
    expect(result).toEqual(new ReturnTaskDto(savedTask));
  });

  it("createTask - With undefined values to categoryId and description", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;

    const createTaskDto = {
      ...MOCK_CREATES.TASK,
      categoryId: undefined,
      description: undefined,
    };

    const savedTask = MOCK_DATABASE_CREATES.TASK(
      createTaskDto,
      MOCK_DEFAULTS.TASK_ID,
      userId
    );

    taskRepositoryMock.save.mockResolvedValue(savedTask);

    await taskService.createTask(userId, createTaskDto);

    expect(taskRepositoryMock.save).toHaveBeenCalledWith({
      ...createTaskDto,
      userId: userId,
      categoryId: createTaskDto.categoryId ? createTaskDto.categoryId : null,
      description: createTaskDto.description ? createTaskDto.description : null,
      completedDate: null,
    });
  });

  it("updateTask - Should return ReturnTaskDto on update task successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const taskId = MOCK_DEFAULTS.TASK_ID;
    const updateTaskDto = MOCK_UPDATES.TASK;

    const task = MOCK_RETURNS.TASK(taskId);

    const updatedTask: ReturnTaskDto & TaskEntity = {
      ...task,
      ...updateTaskDto,
      userId: userId,
      categoryId: updateTaskDto.categoryId ? updateTaskDto.categoryId : null,
      description: updateTaskDto.description ? updateTaskDto.description : "",
      limitDate: MOCK_DATABASE_RETURNS.TASK(taskId, userId).limitDate,
      completedDate:
        MOCK_DATABASE_RETURNS.TASK(taskId, userId).completedDate ||
        MOCK_DEFAULTS.DATE,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
      user: undefined,
      category: undefined,
    };

    taskService.getUserTaskById = jest.fn().mockResolvedValue(task);
    taskRepositoryMock.save.mockResolvedValue(updatedTask);

    const result = await taskService.updateTask(userId, taskId, updateTaskDto);

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(taskService.getUserTaskById).toHaveBeenCalledWith(userId, taskId);
    expect(taskRepositoryMock.save).toHaveBeenCalledWith({
      ...task,
      ...updateTaskDto,
      categoryId: updateTaskDto.categoryId ? updateTaskDto.categoryId : null,
      description: updateTaskDto.description ? updateTaskDto.description : null,
      completedDate: task.completedDate,
    });

    if (updateTaskDto.categoryId) {
      expect(categoryServiceMock.getUserCategoryById).toHaveBeenCalledWith(
        userId,
        updateTaskDto.categoryId
      );
    }

    expect(result).toBeInstanceOf(ReturnTaskDto);
    expect(result).toEqual(new ReturnTaskDto(updatedTask));
  });

  it("updateTask - With undefined values to categoryId and description", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const taskId = MOCK_DEFAULTS.TASK_ID;

    const updateTaskDto = {
      ...MOCK_UPDATES.TASK,
      categoryId: undefined,
      description: undefined,
    };

    const task = MOCK_RETURNS.TASK(taskId);

    const updatedTask: ReturnTaskDto & TaskEntity = {
      ...task,
      ...updateTaskDto,
      userId: userId,
      categoryId: updateTaskDto.categoryId ? updateTaskDto.categoryId : null,
      description: updateTaskDto.description ? updateTaskDto.description : "",
      limitDate: MOCK_DATABASE_RETURNS.TASK(taskId, userId).limitDate,
      completedDate:
        MOCK_DATABASE_RETURNS.TASK(taskId, userId).completedDate ||
        MOCK_DEFAULTS.DATE,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
      user: undefined,
      category: undefined,
    };

    taskService.getUserTaskById = jest.fn().mockResolvedValue(task);
    taskRepositoryMock.save.mockResolvedValue(updatedTask);

    await taskService.updateTask(userId, taskId, updateTaskDto);

    expect(taskRepositoryMock.save).toHaveBeenCalledWith({
      ...task,
      ...updateTaskDto,
      categoryId: updateTaskDto.categoryId ? updateTaskDto.categoryId : null,
      description: updateTaskDto.description ? updateTaskDto.description : null,
      completedDate: task.completedDate,
    });
  });

  it("updateTaskCompletedDate - Should return ReturnTaskDto on complete/incomplete task successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const taskId = MOCK_DEFAULTS.TASK_ID;
    const updateTaskCompletedDateDto = MOCK_UPDATES.TASK_COMPLETED_DATE;

    const task = MOCK_RETURNS.TASK(taskId);

    const updatedTask: ReturnTaskDto & TaskEntity = {
      ...task,
      ...updateTaskCompletedDateDto,
      userId: userId,
      categoryId: task.category?.id ? task.category?.id : null,
      description: task.description ? task.description : "",
      completedDate:
        MOCK_DATABASE_RETURNS.TASK(taskId, userId).completedDate ||
        MOCK_DEFAULTS.DATE,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
      user: undefined,
      category: undefined,
    };

    taskService.getUserTaskById = jest.fn().mockResolvedValue(task);
    taskRepositoryMock.save.mockResolvedValue(updatedTask);

    const result = await taskService.updateTaskCompletedDate(
      userId,
      taskId,
      updateTaskCompletedDateDto
    );

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(taskService.getUserTaskById).toHaveBeenCalledWith(userId, taskId);
    expect(taskRepositoryMock.save).toHaveBeenCalledWith({
      ...task,
      ...updateTaskCompletedDateDto,
      completedDate: updateTaskCompletedDateDto.completedDate
        ? updateTaskCompletedDateDto.completedDate
        : null,
    });

    expect(result).toBeInstanceOf(ReturnTaskDto);
    expect(result).toEqual(new ReturnTaskDto(updatedTask));
  });

  it("updateTaskCompletedDate - With undefined value to completedDate", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const taskId = MOCK_DEFAULTS.TASK_ID;

    const updateTaskCompletedDateDto = {
      ...MOCK_UPDATES.TASK_COMPLETED_DATE,
      completedDate: undefined,
    };

    const task = MOCK_RETURNS.TASK(taskId);

    const updatedTask: ReturnTaskDto & TaskEntity = {
      ...task,
      ...updateTaskCompletedDateDto,
      userId: userId,
      categoryId: task.category?.id ? task.category?.id : null,
      description: task.description ? task.description : "",
      completedDate:
        MOCK_DATABASE_RETURNS.TASK(taskId, userId).completedDate ||
        MOCK_DEFAULTS.DATE,
      createdAt: MOCK_DEFAULTS.DATE,
      updatedAt: MOCK_DEFAULTS.DATE,
      user: undefined,
      category: undefined,
    };

    taskService.getUserTaskById = jest.fn().mockResolvedValue(task);
    taskRepositoryMock.save.mockResolvedValue(updatedTask);

    await taskService.updateTaskCompletedDate(
      userId,
      taskId,
      updateTaskCompletedDateDto
    );

    expect(taskRepositoryMock.save).toHaveBeenCalledWith({
      ...task,
      ...updateTaskCompletedDateDto,
      completedDate: updateTaskCompletedDateDto.completedDate
        ? updateTaskCompletedDateDto.completedDate
        : null,
    });
  });

  it("deleteTask - Should return DeleteResult on delete task successfully", async () => {
    const userId = MOCK_DEFAULTS.USER_ID;
    const taskId = MOCK_DEFAULTS.TASK_ID;

    taskService.getUserTaskById = jest
      .fn()
      .mockResolvedValue(MOCK_RETURNS.TASK(taskId));
    taskRepositoryMock.delete.mockResolvedValue(MOCK_DELETE_RESULT);

    const result = await taskService.deleteTask(userId, taskId);

    expect(userServiceMock.getUserById).toHaveBeenCalledWith(userId);
    expect(taskService.getUserTaskById).toHaveBeenCalledWith(userId, taskId);
    expect(taskRepositoryMock.delete).toHaveBeenCalledWith({
      id: taskId,
    });
    expect(result).toEqual(MOCK_DELETE_RESULT);
  });
});
