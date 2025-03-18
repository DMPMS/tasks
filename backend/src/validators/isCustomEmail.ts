import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "isCustomEmail", async: false })
export class IsCustomEmail implements ValidatorConstraintInterface {
  validate(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid email`;
  }
}
