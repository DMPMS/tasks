import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequestType";
import { MOCK_DEFAULTS } from "../mocks";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
import { UserTypeEnum } from "../../enums/UserTypeEnum";
import { HttpStatusCodeEnum } from "../../enums/HttpStatusCodeEnum";
import { ERROR_MESSAGES } from "../../utils/messages";

describe("roleMiddleware", () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  it("Should authenticate and call next() if user is authorized", () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.DECODED_TOKEN.USER_ID,
      userType: MOCK_DEFAULTS.DECODED_TOKEN.USER_TYPE,
    };

    const middleware = roleMiddleware([UserTypeEnum.User]);
    middleware(req as AuthenticatedRequest, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("Should return an error if the userId is missing (401)", () => {
    req = {
      ...req,
      userType: MOCK_DEFAULTS.DECODED_TOKEN.USER_TYPE,
    };

    const middleware = roleMiddleware([UserTypeEnum.User]);
    middleware(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Unauthorized);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  });

  it("Should return an error if the userType is missing (401)", () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.DECODED_TOKEN.USER_ID,
    };

    const middleware = roleMiddleware([UserTypeEnum.User]);
    middleware(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Unauthorized);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  });

  it("Should return an error if user is not authorized (401)", () => {
    req = {
      ...req,
      userId: MOCK_DEFAULTS.DECODED_TOKEN.USER_ID,
      userType: MOCK_DEFAULTS.DECODED_TOKEN.USER_TYPE,
    };

    const middleware = roleMiddleware([UserTypeEnum.Admin]);
    middleware(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCodeEnum.Unauthorized);
    expect(res.json).toHaveBeenCalledWith(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  });
});
