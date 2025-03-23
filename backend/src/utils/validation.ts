import { validate } from "class-validator";
import { Response } from "express";
import { HttpStatusCodeEnum } from "../enums/HttpStatusCodeEnum";

export async function validateDto(
  dto: object,
  res: Response
): Promise<boolean> {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const formattedErrors = errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
    }));
    res.status(HttpStatusCodeEnum.BadRequest).json({ errors: formattedErrors });
    return false;
  }
  return true;
}
