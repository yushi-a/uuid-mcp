import { validate } from "uuid";
import type { ValidateUuidsInput, ValidateUuidsOutput } from "../schemas/validate.js";

export function validateUuids(input: ValidateUuidsInput): ValidateUuidsOutput {
  const results = input.uuids.map((uuid) => {
    if (validate(uuid)) {
      return { uuid, valid: true as const };
    }
    return { uuid, valid: false as const, reason: "invalid format" };
  });
  return { results };
}
