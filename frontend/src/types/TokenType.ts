import { JwtPayload } from "jwt-decode";
import { UserTypeEnum } from "../enums/UserTypeEnum";

export interface TokenType extends JwtPayload {
  id: number;
  userType: UserTypeEnum;
}
