import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequestType";
import { HttpStatusEnum } from "../enums/HttpStatusEnum";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { ERROR_MESSAGES } from "../utils/messages";

export const roleMiddleware = (allowedRoles: UserTypeEnum[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.userId || !req.userType || !allowedRoles.includes(req.userType)) {
      res
        .status(HttpStatusEnum.Unauthorized)
        .json(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
      return;
    }
    next();
  };
};
