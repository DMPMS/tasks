import { JwtPayload } from "jwt-decode";
import { UserTypeEnum } from "../enums/UserTypeEnum";

export interface TokenType extends JwtPayload {
  userId: number;
  userName: string;
  userEmail: string;
  userType: UserTypeEnum;
}
