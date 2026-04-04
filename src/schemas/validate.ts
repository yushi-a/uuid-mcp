import { z } from "zod";

export const ValidateUuidsInput = z.object({
  uuids: z.array(z.string()).min(1).describe("検証するUUID文字列の配列"),
});

const ValidateUuidsResultValid = z.object({
  uuid: z.string(),
  valid: z.literal(true),
});

const ValidateUuidsResultInvalid = z.object({
  uuid: z.string(),
  valid: z.literal(false),
  reason: z.string().describe("無効な理由"),
});

export const ValidateUuidsResult = z.discriminatedUnion("valid", [
  ValidateUuidsResultValid,
  ValidateUuidsResultInvalid,
]);

export const ValidateUuidsOutput = z.object({
  results: z
    .array(ValidateUuidsResult)
    .describe("入力と同じ順序で各UUIDの検証結果を返す"),
});

export type ValidateUuidsInput = z.infer<typeof ValidateUuidsInput>;
export type ValidateUuidsResult = z.infer<typeof ValidateUuidsResult>;
export type ValidateUuidsOutput = z.infer<typeof ValidateUuidsOutput>;
