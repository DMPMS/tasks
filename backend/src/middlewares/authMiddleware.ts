import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { ERROR_MESSAGES } from "../utils/messages";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";
import { UserTypeEnum } from "../enums/UserTypeEnum";

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res
      .status(HttpStatusCodeEnum.UNAUTHORIZED)
      .send(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error(ERROR_MESSAGES.ENV.MISSING_JWT_SECRET);
  }

  try {
    const decoded = jwt.verify(authorizationHeader, process.env.JWT_SECRET) as {
      id: number;
      userType: UserTypeEnum;
    };
    req.userId = decoded.id;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    res
      .status(HttpStatusCodeEnum.UNAUTHORIZED)
      .send(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }
};
