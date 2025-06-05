import { validate } from "class-validator";

export async function validateDto(dto: object): Promise<boolean> {
  const errors = await validate(dto);

  if (errors.length > 0) {
    const formattedErrors = errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
    }));

    console.log("Validation errors:", formattedErrors);

    return false;
  }
  return true;
}
