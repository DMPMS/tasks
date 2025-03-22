import { UserType } from "./UserType";

export interface AuthType {
  user: UserType;
  token: string;
}
