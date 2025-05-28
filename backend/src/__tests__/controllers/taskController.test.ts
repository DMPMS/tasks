import { Response } from "express";
import { TaskController } from "../../controllers/taskController";
import { TaskService } from "../../services/taskService";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequestType";
import {
  MOCK_CREATES,
  MOCK_DEFAULTS,
  MOCK_ERROR_MESSAGES,
  MOCK_INVALIDS,
  MOCK_RETURNS,
  MOCK_UPDATES,
} from "../mocks";
import { ReturnTaskDto } from "../../dtos/returns/returnTaskDto";
import { CreateTaskDto } from "../../dtos/creates/createTaskDto";
import { plainToInstance } from "class-transformer";
import { validateDto } from "../../utils/validation";
import { HttpStatusCodeEnum } from "../../enums/HttpStatusCodeEnum";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/messages";
import { UpdateTaskDto } from "../../dtos/updates/updateTaskDto";
import { UpdateTaskCompletedDateDto } from "../../dtos/updates/updateTaskCompletedDateDto";
import { RelationsOptionsType } from "../../types/RelationsOptions.type";
import { PAGINATION } from "../../config/constants";
import { validate } from "class-validator";

jest.mock("../../utils/validation");
jest.mock("class-transformer");

describe("TaskController", () => {
  let taskController: TaskController;
  let taskServiceMock: jest.Mocked<TaskService>;
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    taskServiceMock = {
      getUserTasks: jest.fn(),
      getUserTaskById: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      updateTaskCompletedDate: jest.fn(),
      deleteTask: jest.fn(),
    } as unknown as jest.Mocked<TaskService>;

    taskController = new TaskController(taskServiceMock);

    req = {
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    (validateDto as jest.Mock).mockImplementation(async (dto) => {
      const errors = await validate(dto);

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));

        console.log("Validation errors:", formattedErrors);

        return false;
      }
      return true;
    });
  });

  it("getUserTasks - Should return ReturnTaskDto[] on success (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } =
      req.query || {};
    const relationsOptions: RelationsOptionsType = {
      category: true,
    };
    const userId = req.userId;

    taskServiceMock.getUserTasks.mockResolvedValue(MOCK_RETURNS.TASKS);

    await taskController.getUserTasks(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(taskServiceMock.getUserTasks).toHaveBeenCalledWith(
      Number(page),
      Number(limit),
      userId,
      relationsOptions
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(MOCK_RETURNS.TASKS);
  });

  it("getUserTasks - Should use default pagination values if not defined", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } =
      req.query || {};
    const relationsOptions: RelationsOptionsType = {
      category: true,
    };
    const userId = req.userId;

    await taskController.getUserTasks(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(taskServiceMock.getUserTasks).toHaveBeenCalledWith(
      Number(page),
      Number(limit),
      userId,
      relationsOptions
    );
  });

  it("getUserTasks - Should return an error if the userId is missing (400)", async () => {
    req = {
      ...req,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    await taskController.getUserTasks(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED
    );
  });

  it("getUserTasks - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    taskServiceMock.getUserTasks.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await taskController.getUserTasks(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("getUserTasks - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    taskServiceMock.getUserTasks.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await taskController.getUserTasks(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.SELECT_TASK_ERROR
    );
  });

  it("getUserTaskById - Should return ReturnTaskDto on success (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    const relationsOptions: RelationsOptionsType = {
      category: true,
    };
    const userId = req.userId;
    const taskIdNumber = Number(req.params?.taskId);

    taskServiceMock.getUserTaskById.mockResolvedValue(
      MOCK_RETURNS.TASK(taskIdNumber)
    );

    await taskController.getUserTaskById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(taskServiceMock.getUserTaskById).toHaveBeenCalledWith(
      userId,
      taskIdNumber,
      relationsOptions
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(MOCK_RETURNS.TASK(taskIdNumber));
  });

  it("getUserTaskById - Should return an error if the userId is missing (400)", async () => {
    await taskController.getUserTaskById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED
    );
  });

  it("getUserTaskById - Should return an error if the taskId is missing (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    await taskController.getUserTaskById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.TASK_ID_IS_REQUIRED
    );
  });

  it("getUserTaskById - Should return an error if the taskId is invalid (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_INVALIDS.TASK_ID },
    };

    await taskController.getUserTaskById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(ERROR_MESSAGES.TASK.INVALID_TASK_ID);
  });

  it("getUserTaskById - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    taskServiceMock.getUserTaskById.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await taskController.getUserTaskById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("getUserTaskById - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    taskServiceMock.getUserTaskById.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await taskController.getUserTaskById(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.SELECT_TASK_BY_ID_ERROR
    );
  });

  it("createTask - Should return ReturnTaskDto on success (201)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      body: MOCK_CREATES.TASK,
    };

    const createTaskDto = Object.assign(new CreateTaskDto(), req.body);

    const userId = req.userId;

    const mockedTask: ReturnTaskDto = {
      ...req.body,
      id: 1,
      description: MOCK_CREATES.TASK.description
        ? MOCK_CREATES.TASK.description
        : "",
      limitDate: new Date(MOCK_CREATES.TASK.limitDate),
    };

    (plainToInstance as jest.Mock).mockReturnValue(createTaskDto);
    taskServiceMock.createTask.mockResolvedValue(mockedTask);

    await taskController.createTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(plainToInstance).toHaveBeenCalledWith(CreateTaskDto, req.body, {
      excludeExtraneousValues: true,
    });
    expect(validateDto).toHaveBeenCalledWith(createTaskDto);
    expect(taskServiceMock.createTask).toHaveBeenCalledWith(
      userId,
      expect.any(CreateTaskDto)
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Created);
    expect(res.json).toHaveBeenCalledWith(mockedTask);
  });

  it("createTask - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await taskController.createTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("createTask - Should return an error if the userId is missing (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);

    await taskController.createTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED
    );
  });

  it("createTask - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    taskServiceMock.createTask.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await taskController.createTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("createTask - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    taskServiceMock.createTask.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await taskController.createTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.CREATE_TASK_ERROR
    );
  });

  it("updateTask - Should return ReturnTaskDto on success (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      body: MOCK_UPDATES.TASK,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    const updateTaskDto = Object.assign(new UpdateTaskDto(), req.body);

    const userId = req.userId;
    const taskIdNumber = Number(req.params?.taskId);

    const mockedTask: ReturnTaskDto = {
      ...req.body,
      id: taskIdNumber,
      description: MOCK_UPDATES.TASK.description
        ? MOCK_UPDATES.TASK.description
        : "",
      limitDate: new Date(MOCK_UPDATES.TASK.limitDate),
    };

    (plainToInstance as jest.Mock).mockReturnValue(updateTaskDto);
    taskServiceMock.updateTask.mockResolvedValue(mockedTask);

    await taskController.updateTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(plainToInstance).toHaveBeenCalledWith(UpdateTaskDto, req.body, {
      excludeExtraneousValues: true,
    });
    expect(validateDto).toHaveBeenCalledWith(updateTaskDto);
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith(
      userId,
      taskIdNumber,
      expect.any(UpdateTaskDto)
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(mockedTask);
  });

  it("updateTask - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await taskController.updateTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("updateTask - Should return an error if the userId is missing (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);

    await taskController.updateTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED
    );
  });

  it("updateTask - Should return an error if the taskId is missing (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);

    await taskController.updateTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.TASK_ID_IS_REQUIRED
    );
  });

  it("updateTask - Should return an error if the taskId is invalid (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_INVALIDS.TASK_ID },
    };

    (validateDto as jest.Mock).mockResolvedValue(true);

    await taskController.updateTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(ERROR_MESSAGES.TASK.INVALID_TASK_ID);
  });

  it("updateTask - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    taskServiceMock.updateTask.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await taskController.updateTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("updateTask - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    taskServiceMock.updateTask.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await taskController.updateTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.UPDATE_TASK_ERROR
    );
  });

  it("updateTaskCompletedDate - Should return ReturnTaskDto on success (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      body: MOCK_UPDATES.TASK_COMPLETED_DATE,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    const updateTaskCompletedDateDto = Object.assign(
      new UpdateTaskCompletedDateDto(),
      req.body
    );

    const userId = req.userId;
    const taskIdNumber = Number(req.params?.taskId);

    const mockedTask: ReturnTaskDto = {
      ...req.body,
      ...MOCK_UPDATES.TASK,
      id: taskIdNumber,
      description: MOCK_UPDATES.TASK.description
        ? MOCK_UPDATES.TASK.description
        : "",
      limitDate: new Date(MOCK_UPDATES.TASK.limitDate),
      completedDate: MOCK_UPDATES.TASK_COMPLETED_DATE.completedDate
        ? new Date(MOCK_UPDATES.TASK_COMPLETED_DATE.completedDate)
        : null,
    };

    (plainToInstance as jest.Mock).mockReturnValue(updateTaskCompletedDateDto);
    taskServiceMock.updateTaskCompletedDate.mockResolvedValue(mockedTask);

    await taskController.updateTaskCompletedDate(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(plainToInstance).toHaveBeenCalledWith(
      UpdateTaskCompletedDateDto,
      req.body,
      {
        excludeExtraneousValues: true,
      }
    );
    expect(validateDto).toHaveBeenCalledWith(updateTaskCompletedDateDto);
    expect(taskServiceMock.updateTaskCompletedDate).toHaveBeenCalledWith(
      userId,
      taskIdNumber,
      expect.any(UpdateTaskCompletedDateDto)
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(mockedTask);
  });

  it("updateTaskCompletedDate - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await taskController.updateTaskCompletedDate(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("updateTaskCompletedDate - Should return an error if the userId is missing (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);

    await taskController.updateTaskCompletedDate(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED
    );
  });

  it("updateTaskCompletedDate - Should return an error if the taskId is missing (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);

    await taskController.updateTaskCompletedDate(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.TASK_ID_IS_REQUIRED
    );
  });

  it("updateTaskCompletedDate - Should return an error if the taskId is invalid (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_INVALIDS.TASK_ID },
    };

    (validateDto as jest.Mock).mockResolvedValue(true);

    await taskController.updateTaskCompletedDate(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(ERROR_MESSAGES.TASK.INVALID_TASK_ID);
  });

  it("updateTaskCompletedDate - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    taskServiceMock.updateTaskCompletedDate.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await taskController.updateTaskCompletedDate(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("updateTaskCompletedDate - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    taskServiceMock.updateTaskCompletedDate.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await taskController.updateTaskCompletedDate(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.UPDATE_TASK_COMPLETED_DATE_ERROR
    );
  });

  it("deleteTask - Should delete the task successfully (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    const userId = req.userId;
    const taskIdNumber = Number(req.params?.taskId);

    await taskController.deleteTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(
      userId,
      taskIdNumber
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Ok);
    expect(res.send).toHaveBeenCalledWith(
      SUCCESS_MESSAGES.TASK.TASK_DELETED_SUCCESSFULLY
    );
  });

  it("deleteTask - Should return an error if the userId is missing (400)", async () => {
    await taskController.deleteTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.USER_ID_IS_REQUIRED
    );
  });

  it("deleteTask - Should return an error if the taskId is missing (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    await taskController.deleteTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.TASK_ID_IS_REQUIRED
    );
  });

  it("deleteTask - Should return an error if the taskId is invalid (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_INVALIDS.TASK_ID },
    };

    await taskController.deleteTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(ERROR_MESSAGES.TASK.INVALID_TASK_ID);
  });

  it("deleteTask - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    taskServiceMock.deleteTask.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await taskController.deleteTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("deleteTask - Should return an error if an unexpected error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      params: { taskId: MOCK_DEFAULTS.REQ.PARAMS.TASK_ID },
    };

    taskServiceMock.deleteTask.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await taskController.deleteTask(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.TASK.DELETE_TASK_ERROR
    );
  });
});
