import { NotificationEnum } from "../enums/NotificationEnum";

export interface NotificationType {
  message: string;
  type: NotificationEnum;
}
