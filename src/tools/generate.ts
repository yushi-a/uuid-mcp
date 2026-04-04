import { v7 as uuidv7 } from "uuid";
import { GenerateUuidsInput, GenerateUuidsOutput } from "../schemas/generate.js";

export function generateUuids(input: GenerateUuidsInput): GenerateUuidsOutput {
  const count = input.count ?? 1;
  const uuids = Array.from({ length: count }, () => uuidv7());
  return { uuids };
}
