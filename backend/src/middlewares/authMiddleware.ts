import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";
import { ERROR_MESSAGES } from "../utils/messages";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res
      .status(HttpStatusCodeEnum.UNAUTHORIZED)
      .send(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error(ERROR_MESSAGES.AUTH.MISSING_JWT_SECRET);
  }

  try {
    const decoded = jwt.verify(authorizationHeader, process.env.JWT_SECRET) as {
      id: number;
    };
    req.userId = decoded.id;
    next();
  } catch (error) {
    res
      .status(HttpStatusCodeEnum.UNAUTHORIZED)
      .send(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
  }
};
