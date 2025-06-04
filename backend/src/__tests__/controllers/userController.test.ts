import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequestType";
import {
  MOCK_CREATES,
  MOCK_DEFAULTS,
  MOCK_DELETES,
  MOCK_ERROR_MESSAGES,
  MOCK_INVALIDS,
  MOCK_RETURNS,
  MOCK_UPDATES,
} from "../mocks";
import { plainToInstance } from "class-transformer";
import { validateDto } from "../../utils/validation";
import { HttpStatusEnum } from "../../enums/HttpStatusEnum";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/messages";
import { PAGINATION, USER } from "../../config/constants";
import { validate } from "class-validator";
import { UserController } from "../../controllers/userController";
import { UserService } from "../../services/userService";
import { CreateUserDto } from "../../dtos/creates/createUserDto";
import { ReturnUserDto } from "../../dtos/returns/returnUserDto";
import { UserTypeEnum } from "../../enums/UserTypeEnum";
import { UpdateUserDto } from "../../dtos/updates/updateUserDto";
import { DeleteUserDto } from "../../dtos/deletes/deleteUserDto";
import { HttpError } from "../../utils/httpError";

jest.mock("../../utils/validation");
jest.mock("class-transformer");

describe("UserController", () => {
  let userController: UserController;
  let userServiceMock: jest.Mocked<UserService>;
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    userServiceMock = {
      getUsers: jest.fn(),
      getUserInfo: jest.fn(),
      createUser: jest.fn(),
      createAdmin: jest.fn(),
      updateUser: jest.fn(),
      deleteUserMy: jest.fn(),
      deleteUser: jest.fn(),
      deleteAdmin: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    userController = new UserController(userServiceMock);

    req = {
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
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

  it("getUsers - Should return ReturnUserDto[] on get users successfully (200)", async () => {
    req = {
      ...req,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } =
      req.query || {};

    userServiceMock.getUsers.mockResolvedValue(MOCK_RETURNS.USERS);

    await userController.getUsers(req as AuthenticatedRequest, res as Response);

    expect(userServiceMock.getUsers).toHaveBeenCalledWith(
      Number(page),
      Number(limit)
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(MOCK_RETURNS.USERS);
  });

  it("getUsers - Should use default pagination values if not defined", async () => {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } =
      req.query || {};

    await userController.getUsers(req as AuthenticatedRequest, res as Response);

    expect(userServiceMock.getUsers).toHaveBeenCalledWith(
      Number(page),
      Number(limit)
    );
  });

  it("getUsers - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    userServiceMock.getUsers.mockRejectedValue(
      new HttpError(
        HttpStatusEnum.BadRequest,
        MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
      )
    );

    await userController.getUsers(req as AuthenticatedRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
    );
  });

  it("getUsers - Should return an error if an internal server error occurs (500)", async () => {
    req = {
      ...req,
      query: {
        page: MOCK_DEFAULTS.REQ.QUERY.PAGE,
        limit: MOCK_DEFAULTS.REQ.QUERY.LIMIT,
      },
    };

    userServiceMock.getUsers.mockRejectedValue(
      MOCK_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );

    await userController.getUsers(req as AuthenticatedRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.InternalServerError);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.SELECT_USER_ERROR
    );
  });

  it("getUserInfo - Should return ReturnUserDto on get user info successfully (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    const userId = req.userId;

    userServiceMock.getUserInfo.mockResolvedValue(
      MOCK_RETURNS.USER(userId || MOCK_DEFAULTS.USER_ID)
    );

    await userController.getUserInfo(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(userServiceMock.getUserInfo).toHaveBeenCalledWith(userId);
    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_RETURNS.USER(userId || MOCK_DEFAULTS.USER_ID)
    );
  });

  it("getUserInfo - Should return an error if the userId is missing (400)", async () => {
    await userController.getUserInfo(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.USER_ID_IS_REQUIRED
    );
  });

  it("getUserInfo - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    userServiceMock.getUserInfo.mockRejectedValue(
      new HttpError(
        HttpStatusEnum.BadRequest,
        MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
      )
    );

    await userController.getUserInfo(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
    );
  });

  it("getUserInfo - Should return an error if an internal server error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    userServiceMock.getUserInfo.mockRejectedValue(
      MOCK_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );

    await userController.getUserInfo(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.InternalServerError);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.SELECT_USER_INFO_ERROR
    );
  });

  it("createUser - Should return ReturnUserDto on create user successfully (201)", async () => {
    req = {
      ...req,
      body: MOCK_CREATES.USER,
    };

    const createUserDto = Object.assign(new CreateUserDto(), req.body);

    const mockedUser: ReturnUserDto = {
      ...req.body,
      id: 1,
    };

    (plainToInstance as jest.Mock).mockReturnValue(createUserDto);
    userServiceMock.createUser.mockResolvedValue(mockedUser);

    await userController.createUser(req as Request, res as Response);

    expect(plainToInstance).toHaveBeenCalledWith(CreateUserDto, req.body, {
      excludeExtraneousValues: true,
    });
    expect(validateDto).toHaveBeenCalledWith(createUserDto);
    expect(userServiceMock.createUser).toHaveBeenCalledWith(
      expect.any(CreateUserDto)
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Created);
    expect(res.json).toHaveBeenCalledWith(mockedUser);
  });

  it("createUser - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await userController.createUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("createUser - Should return an error if an error of type Error occurs (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);
    userServiceMock.createUser.mockRejectedValue(
      new HttpError(
        HttpStatusEnum.BadRequest,
        MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
      )
    );

    await userController.createUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
    );
  });

  it("createUser - Should return an error if an internal server error occurs (500)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);
    userServiceMock.createUser.mockRejectedValue(
      MOCK_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );

    await userController.createUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.InternalServerError);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.CREATE_USER_ERROR
    );
  });

  it("createAdmin - Should return ReturnUserDto on create admin successfully (201)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      userType: UserTypeEnum.Root,
      body: MOCK_CREATES.ADMIN,
    };

    const createUserDto = Object.assign(new CreateUserDto(), req.body);

    const userId = req.userId;
    const userType = req.userType;

    const mockedUser: ReturnUserDto = {
      ...req.body,
      id: 1,
    };

    (plainToInstance as jest.Mock).mockReturnValue(createUserDto);
    userServiceMock.createUser.mockResolvedValue(mockedUser);

    await userController.createAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(plainToInstance).toHaveBeenCalledWith(CreateUserDto, req.body, {
      excludeExtraneousValues: true,
    });
    expect(validateDto).toHaveBeenCalledWith(createUserDto);
    expect(userServiceMock.createUser).toHaveBeenCalledWith(
      expect.any(CreateUserDto),
      userId,
      userType
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Created);
    expect(res.json).toHaveBeenCalledWith(mockedUser);
  });

  it("createAdmin - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await userController.createAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("createAdmin - Should return an error if the userId is missing (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);

    await userController.createAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.USER_ID_IS_REQUIRED
    );
  });

  it("createAdmin - Should return an error if the userType is missing (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);

    await userController.createAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.USER_TYPE_IS_REQUIRED
    );
  });

  it("createAdmin - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      userType: UserTypeEnum.Root,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    userServiceMock.createUser.mockRejectedValue(
      new HttpError(
        HttpStatusEnum.BadRequest,
        MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
      )
    );

    await userController.createAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
    );
  });

  it("createAdmin - Should return an error if an internal server error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      userType: UserTypeEnum.Root,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    userServiceMock.createUser.mockRejectedValue(
      MOCK_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );

    await userController.createAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.InternalServerError);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.CREATE_USER_ERROR
    );
  });

  it("updateUser - Should return ReturnUserDto on update user successfully (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      body: MOCK_UPDATES.USER,
    };

    const updateUserDto = Object.assign(new UpdateUserDto(), req.body);

    const userId = req.userId;

    const mockedUser: ReturnUserDto = {
      ...req.body,
      id: 1,
    };

    (plainToInstance as jest.Mock).mockReturnValue(updateUserDto);
    userServiceMock.updateUser.mockResolvedValue(mockedUser);

    await userController.updateUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(plainToInstance).toHaveBeenCalledWith(UpdateUserDto, req.body, {
      excludeExtraneousValues: true,
    });
    expect(validateDto).toHaveBeenCalledWith(updateUserDto);
    expect(userServiceMock.updateUser).toHaveBeenCalledWith(
      userId,
      expect.any(UpdateUserDto)
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(mockedUser);
  });

  it("updateUser - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await userController.updateUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("updateUser - Should return an error if the userId is missing (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);

    await userController.updateUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.USER_ID_IS_REQUIRED
    );
  });

  it("updateUser - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    userServiceMock.updateUser.mockRejectedValue(
      new HttpError(
        HttpStatusEnum.BadRequest,
        MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
      )
    );

    await userController.updateUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
    );
  });

  it("updateUser - Should return an error if an internal server error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    userServiceMock.updateUser.mockRejectedValue(
      MOCK_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );

    await userController.updateUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.InternalServerError);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.UPDATE_USER_ERROR
    );
  });

  it("deleteUserMy - Should delete the my user successfully (200)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
      body: MOCK_DELETES.USER,
    };

    const deleteUserDto = Object.assign(new DeleteUserDto(), req.body);

    const userId = req.userId;

    (plainToInstance as jest.Mock).mockReturnValue(deleteUserDto);

    await userController.deleteUserMy(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(plainToInstance).toHaveBeenCalledWith(DeleteUserDto, req.body, {
      excludeExtraneousValues: true,
    });
    expect(validateDto).toHaveBeenCalledWith(deleteUserDto);
    expect(userServiceMock.deleteUserMy).toHaveBeenCalledWith(
      userId,
      deleteUserDto
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(
      SUCCESS_MESSAGES.USER.USER_MY_DELETED_SUCCESSFULLY
    );
  });

  it("deleteUserMy - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await userController.deleteUserMy(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("deleteUserMy - Should return an error if the userId is missing (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);

    await userController.deleteUserMy(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.USER_ID_IS_REQUIRED
    );
  });

  it("deleteUserMy - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    userServiceMock.deleteUserMy.mockRejectedValue(
      new HttpError(
        HttpStatusEnum.BadRequest,
        MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
      )
    );

    await userController.deleteUserMy(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
    );
  });

  it("deleteUserMy - Should return an error if an internal server error occurs (500)", async () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.USER_ID,
    };

    (validateDto as jest.Mock).mockResolvedValue(true);
    userServiceMock.deleteUserMy.mockRejectedValue(
      MOCK_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );

    await userController.deleteUserMy(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.InternalServerError);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.DELETE_USER_MY_ERROR
    );
  });

  it("deleteUser - Should delete the user successfully (200)", async () => {
    req = {
      ...req,
      params: { userDeleteId: MOCK_DEFAULTS.REQ.PARAMS.USER_DELETE_ID },
    };

    const userDeleteIdNumber = Number(req.params?.userDeleteId);

    await userController.deleteUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(userServiceMock.deleteUser).toHaveBeenCalledWith(userDeleteIdNumber);
    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(
      SUCCESS_MESSAGES.USER.USER_DELETED_SUCCESSFULLY
    );
  });

  it("deleteUser - Should return an error if the userDeleteId is missing (400)", async () => {
    await userController.deleteUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.USER_DELETE_ID_IS_REQUIRED
    );
  });

  it("deleteUser - Should return an error if the userDeleteId is invalid (400)", async () => {
    req = {
      ...req,
      params: { userDeleteId: MOCK_INVALIDS.USER_DELETE_ID },
    };

    await userController.deleteUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.INVALID_USER_DELETE_ID
    );
  });

  it("deleteUser - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      params: { userDeleteId: MOCK_DEFAULTS.REQ.PARAMS.USER_DELETE_ID },
    };

    userServiceMock.deleteUser.mockRejectedValue(
      new HttpError(
        HttpStatusEnum.BadRequest,
        MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
      )
    );

    await userController.deleteUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
    );
  });

  it("deleteUser - Should return an error if an internal server error occurs (500)", async () => {
    req = {
      ...req,
      params: { userDeleteId: MOCK_DEFAULTS.REQ.PARAMS.USER_DELETE_ID },
    };

    userServiceMock.deleteUser.mockRejectedValue(
      MOCK_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );

    await userController.deleteUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.InternalServerError);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.DELETE_USER_ERROR
    );
  });

  it("deleteAdmin - Should delete the admin successfully (200)", async () => {
    req = {
      ...req,
      params: { adminDeleteId: MOCK_DEFAULTS.REQ.PARAMS.ADMIN_DELETE_ID },
    };

    const adminDeleteIdNumber = Number(req.params?.adminDeleteId);

    await userController.deleteAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(userServiceMock.deleteAdmin).toHaveBeenCalledWith(
      adminDeleteIdNumber
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(
      SUCCESS_MESSAGES.USER.ADMIN_DELETED_SUCCESSFULLY
    );
  });

  it("deleteAdmin - Should return an error if the adminDeleteId is missing (400)", async () => {
    await userController.deleteAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.ADMIN_DELETE_ID_IS_REQUIRED
    );
  });

  it("deleteAdmin - Should return an error if the adminDeleteId is invalid (400)", async () => {
    req = {
      ...req,
      params: { adminDeleteId: MOCK_INVALIDS.ADMIN_DELETE_ID },
    };

    await userController.deleteAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.INVALID_ADMIN_DELETE_ID
    );
  });

  it("deleteAdmin - Should return an error if an error of type Error occurs (400)", async () => {
    req = {
      ...req,
      params: { adminDeleteId: MOCK_DEFAULTS.REQ.PARAMS.ADMIN_DELETE_ID },
    };

    userServiceMock.deleteAdmin.mockRejectedValue(
      new HttpError(
        HttpStatusEnum.BadRequest,
        MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
      )
    );

    await userController.deleteAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
    );
  });

  it("deleteAdmin - Should return an error if an internal server error occurs (500)", async () => {
    req = {
      ...req,
      params: { adminDeleteId: MOCK_DEFAULTS.REQ.PARAMS.ADMIN_DELETE_ID },
    };

    userServiceMock.deleteAdmin.mockRejectedValue(
      MOCK_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );

    await userController.deleteAdmin(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.InternalServerError);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.USER.DELETE_ADMIN_ERROR
    );
  });
});
