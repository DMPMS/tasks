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

export const validateTimestamp = (timestampString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

  if (!regex.test(timestampString)) {
    return false;
  }

  const [datePart, timePart] = timestampString.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if (month < 1 || month > 12) {
    return false;
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return false;
  }

  return true;
};
