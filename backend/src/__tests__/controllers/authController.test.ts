import { AuthController } from "../../controllers/authController";
import { AuthService } from "../../services/authService";
import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "../../enums/HttpStatusCodeEnum";
import { ERROR_MESSAGES } from "../../utils/messages";
import { validateDto } from "../../utils/validation";
import { CreateAuthDto } from "../../dtos/creates/createAuthDto";
import { plainToInstance } from "class-transformer";
import { MOCK_CREATES, MOCK_ERROR_MESSAGES, MOCK_RETURNS } from "../mocks";

jest.mock("../../utils/validation");
jest.mock("class-transformer");

describe("AuthController", () => {
  let authController: AuthController;
  let authServiceMock: jest.Mocked<AuthService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    authServiceMock = {
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    authController = new AuthController(authServiceMock);

    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  it("login - Should return ReturnAuthDto on success (201)", async () => {
    req = {
      ...req,
      body: MOCK_CREATES.AUTH,
    };

    (plainToInstance as jest.Mock).mockReturnValue(new CreateAuthDto());
    (validateDto as jest.Mock).mockResolvedValue(true);
    authServiceMock.login.mockResolvedValue(MOCK_RETURNS.AUTH);

    await authController.login(req as Request, res as Response);

    expect(plainToInstance).toHaveBeenCalledWith(CreateAuthDto, req.body, {
      excludeExtraneousValues: true,
    });
    expect(validateDto).toHaveBeenCalledWith(expect.any(CreateAuthDto), res);
    expect(authServiceMock.login).toHaveBeenCalledWith(
      expect.any(CreateAuthDto)
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Created);
    expect(res.json).toHaveBeenCalledWith(MOCK_RETURNS.AUTH);
  });

  it("login - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await authController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("login - Should return an error if an error of type Error occurs (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);
    authServiceMock.login.mockRejectedValue(
      new Error(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR)
    );

    await authController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.BadRequest);
    expect(res.send).toHaveBeenCalledWith(MOCK_ERROR_MESSAGES.ERROR_TYPE_ERROR);
  });

  it("login - Should return an error if an unexpected error occurs (500)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);
    authServiceMock.login.mockRejectedValue(
      MOCK_ERROR_MESSAGES.UNEXPECTED_ERROR
    );

    await authController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(
      HttpStatusCodeEnum.InternalServerError
    );
    expect(res.send).toHaveBeenCalledWith(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
    );
  });
});
