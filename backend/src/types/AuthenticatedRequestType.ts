import { Request } from "express";
import { UserTypeEnum } from "../enums/UserTypeEnum";

export interface AuthenticatedRequest extends Request {
  userId?: number;
  userName?: string;
  userEmail?: string;
  userType?: UserTypeEnum;
}
