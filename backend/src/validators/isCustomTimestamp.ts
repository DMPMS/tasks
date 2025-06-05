import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "isCustomTimestamp", async: false })
export class IsCustomTimestamp implements ValidatorConstraintInterface {
  validate(timestampString: string) {
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
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be in the format 'YYYY-MM-DD HH:mm'`;
  }
}
