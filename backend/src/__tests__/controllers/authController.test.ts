import { AuthController } from "../../controllers/authController";
import { AuthService } from "../../services/authService";
import { Request, Response } from "express";
import { HttpStatusEnum } from "../../enums/HttpStatusEnum";
import { ERROR_MESSAGES } from "../../utils/messages";
import { validateDto } from "../../utils/validation";
import { CreateAuthDto } from "../../dtos/creates/createAuthDto";
import { plainToInstance } from "class-transformer";
import {
  MOCK_CREATES,
  MOCK_DEFAULTS,
  MOCK_ERROR_MESSAGES,
  MOCK_RETURNS,
} from "../mocks";
import { validate } from "class-validator";
import { HttpError } from "../../utils/httpError";

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

  it("login - Should return ReturnAuthDto on login successfully (201)", async () => {
    req = {
      ...req,
      body: MOCK_CREATES.AUTH,
    };

    const createAuthDto = Object.assign(new CreateAuthDto(), req.body);

    (plainToInstance as jest.Mock).mockReturnValue(createAuthDto);
    authServiceMock.login.mockResolvedValue(
      MOCK_RETURNS.AUTH(MOCK_DEFAULTS.TOKEN)
    );

    await authController.login(req as Request, res as Response);

    expect(plainToInstance).toHaveBeenCalledWith(CreateAuthDto, req.body, {
      excludeExtraneousValues: true,
    });
    expect(validateDto).toHaveBeenCalledWith(createAuthDto);
    expect(authServiceMock.login).toHaveBeenCalledWith(
      expect.any(CreateAuthDto)
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Ok);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_RETURNS.AUTH(MOCK_DEFAULTS.TOKEN)
    );
  });

  it("login - Should return an error if the data is invalid (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(false);

    await authController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.DTO.INVALID_DATA);
  });

  it("login - Should return an error if an error of type Error occurs (400)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);
    authServiceMock.login.mockRejectedValue(
      new HttpError(
        HttpStatusEnum.BadRequest,
        MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
      )
    );

    await authController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.BadRequest);
    expect(res.json).toHaveBeenCalledWith(
      MOCK_ERROR_MESSAGES.ERROR_INSTANCE_OF_HTTP_ERROR
    );
  });

  it("login - Should return an error if an internal server error occurs (500)", async () => {
    (validateDto as jest.Mock).mockResolvedValue(true);
    authServiceMock.login.mockRejectedValue(
      MOCK_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );

    await authController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.InternalServerError);
    expect(res.json).toHaveBeenCalledWith(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
    );
  });
});
