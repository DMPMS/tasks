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

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    res
      .status(HttpStatusCodeEnum.Unauthorized)
      .send(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error(ERROR_MESSAGES.ENV.MISSING_JWT_SECRET);
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: number;
      userName: string;
      userEmail: string;
      userType: UserTypeEnum;
    };

    req.userId = decoded.userId;
    req.userName = decoded.userName;
    req.userEmail = decoded.userEmail;
    req.userType = decoded.userType;

    next();
  } catch (error) {
    res
      .status(HttpStatusCodeEnum.Unauthorized)
      .send(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }
};
