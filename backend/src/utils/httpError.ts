import { HttpStatusEnum } from "../enums/HttpStatusEnum";

export class HttpError extends Error {
  status: HttpStatusEnum;

  constructor(status: HttpStatusEnum, message: string) {
    super(message);

    this.status = status;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
