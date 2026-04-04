import { z } from "zod";

export const GenerateUuidsInput = z.object({
  count: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(1)
    .describe("生成するUUID v7の個数 (1〜100、デフォルト: 1)"),
});

export const GenerateUuidsOutput = z.object({
  uuids: z.array(z.string()).describe("生成されたUUID v7の配列"),
});

// z.input を使うことで default 付きフィールドがオプショナルな型になる
export type GenerateUuidsInput = z.input<typeof GenerateUuidsInput>;
export type GenerateUuidsOutput = z.infer<typeof GenerateUuidsOutput>;
