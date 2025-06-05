import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequestType";
import { MOCK_DEFAULTS } from "../mocks";
import { HttpStatusEnum } from "../../enums/HttpStatusEnum";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../../utils/messages";
import { authMiddleware } from "../../middlewares/authMiddleware";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    process.env.JWT_SECRET = "mockJwtSecret";

    next = jest.fn();
  });

  it("Should authenticate and call next() if token is valid", () => {
    req = {
      ...req,
      headers: { authorization: MOCK_DEFAULTS.REQ.HEADERS.AUTHORIZATION },
    };

    const jwtSecret = process.env.JWT_SECRET;

    const token = req.headers?.authorization?.split(" ")[1];

    const userPayload = {
      userId: MOCK_DEFAULTS.DECODED_TOKEN.USER_ID,
      userName: MOCK_DEFAULTS.DECODED_TOKEN.USER_NAME,
      userEmail: MOCK_DEFAULTS.DECODED_TOKEN.USER_EMAIL,
      userType: MOCK_DEFAULTS.DECODED_TOKEN.USER_TYPE,
    };

    (jwt.verify as jest.Mock).mockReturnValue(userPayload);

    authMiddleware(req as AuthenticatedRequest, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, jwtSecret);
    expect(req.userId).toBe(userPayload.userId);
    expect(req.userName).toBe(userPayload.userName);
    expect(req.userEmail).toBe(userPayload.userEmail);
    expect(req.userType).toBe(userPayload.userType);
    expect(next).toHaveBeenCalled();
  });

  it("Should return an error if user is not authenticated (401)", () => {
    authMiddleware(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Unauthorized);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  });

  it("Should return an error if authorization header does not start with Bearer (401)", () => {
    req.headers = { authorization: MOCK_DEFAULTS.TOKEN };

    authMiddleware(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Unauthorized);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  });

  it("Should throw an error if JWT_SECRET is missing", () => {
    req = {
      ...req,
      headers: { authorization: MOCK_DEFAULTS.REQ.HEADERS.AUTHORIZATION },
    };

    delete process.env.JWT_SECRET;

    expect(() =>
      authMiddleware(req as AuthenticatedRequest, res as Response, next)
    ).toThrow(ERROR_MESSAGES.ENV.MISSING_JWT_SECRET);
  });

  it("Should return an error if token JWT is invalid (401)", () => {
    req = {
      ...req,
      headers: { authorization: MOCK_DEFAULTS.REQ.HEADERS.AUTHORIZATION },
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error();
    });

    authMiddleware(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusEnum.Unauthorized);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  });
});
