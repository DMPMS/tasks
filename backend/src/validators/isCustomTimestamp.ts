import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { validateTimestamp } from "../utils/validation";

@ValidatorConstraint({ name: "isCustomTimestamp", async: false })
export class IsCustomTimestamp implements ValidatorConstraintInterface {
  validate(timestampString: string) {
    return validateTimestamp(timestampString);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be in the format 'YYYY-MM-DD HH:mm'`;
  }
}
