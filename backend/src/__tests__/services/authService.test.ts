import { AuthService } from "../../services/authService";
import { Repository } from "typeorm";
import { UserEntity } from "../../entities/userEntity";
import { MOCK_CREATES, MOCK_DATABASE_RETURNS, MOCK_DEFAULTS } from "../mocks";
import jwt from "jsonwebtoken";
import { validatePassword } from "../../utils/password";
import { ERROR_MESSAGES } from "../../utils/messages";

jest.mock("jsonwebtoken");
jest.mock("../../utils/password");

describe("AuthService", () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<Repository<UserEntity>>;

  const oldEnv = process.env;

  beforeEach(() => {
    userRepositoryMock = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<UserEntity>>;

    authService = new AuthService(userRepositoryMock);

    process.env = { ...oldEnv };
  });

  it("Should instantiate AuthService without args", () => {
    const service = new AuthService();

    expect(service).toBeInstanceOf(AuthService);
  });

  it("login - Should return ReturnAuthDto on login successfully", async () => {
    const createAuthDto = MOCK_CREATES.AUTH;

    const user = MOCK_DATABASE_RETURNS.USER(MOCK_DEFAULTS.USER_ID);

    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

    userRepositoryMock.findOne.mockResolvedValue(user);
    (validatePassword as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue(MOCK_DEFAULTS.TOKEN);

    const result = await authService.login(createAuthDto);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { email: createAuthDto.email.toLowerCase() },
    });
    expect(validatePassword).toHaveBeenCalledWith(
      createAuthDto.password,
      user.password
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userType: user.userType,
      },
      jwtSecret,
      {
        expiresIn: jwtExpiresIn,
      }
    );
    expect(result).toEqual({ token: `Bearer ${MOCK_DEFAULTS.TOKEN}` });
  });

  it("login - Should return an error if the user is not found", async () => {
    const createAuthDto = MOCK_CREATES.AUTH;

    userRepositoryMock.findOne.mockResolvedValue(null);

    await expect(authService.login(createAuthDto)).rejects.toThrow(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
    );
  });

  it("login - Should return an error if the password is invalid", async () => {
    const createAuthDto = MOCK_CREATES.AUTH;

    const user = MOCK_DATABASE_RETURNS.USER(MOCK_DEFAULTS.USER_ID);

    userRepositoryMock.findOne.mockResolvedValue(user);
    (validatePassword as jest.Mock).mockResolvedValue(false);

    await expect(authService.login(createAuthDto)).rejects.toThrow(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
    );
  });

  it("login - Should return an error if the JWT_SECRET is missing", async () => {
    const createAuthDto = MOCK_CREATES.AUTH;

    delete process.env.JWT_SECRET;

    const user = MOCK_DATABASE_RETURNS.USER(MOCK_DEFAULTS.USER_ID);

    userRepositoryMock.findOne.mockResolvedValue(user);
    (validatePassword as jest.Mock).mockResolvedValue(true);

    await expect(authService.login(createAuthDto)).rejects.toThrow(
      ERROR_MESSAGES.ENV.MISSING_JWT_SECRET
    );
  });

  it("login - Should return an error if the JWT_EXPIRES_IN is missing", async () => {
    const createAuthDto = MOCK_CREATES.AUTH;

    delete process.env.JWT_EXPIRES_IN;

    const user = MOCK_DATABASE_RETURNS.USER(MOCK_DEFAULTS.USER_ID);

    userRepositoryMock.findOne.mockResolvedValue(user);
    (validatePassword as jest.Mock).mockResolvedValue(true);

    await expect(authService.login(createAuthDto)).rejects.toThrow(
      ERROR_MESSAGES.ENV.MISSING_JWT_EXPIRES_IN
    );
  });
});
