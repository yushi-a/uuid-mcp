import { z } from "zod";

export const ParseUuidsInput = z.object({
  uuids: z.array(z.string()).min(1).describe("パースするUUID v7文字列の配列"),
});

export const ParseUuidsResultSuccess = z.object({
  uuid: z.string(),
  timestamp: z
    .string()
    .describe("UUID v7に埋め込まれたタイムスタンプ (ISO 8601形式、実行環境のタイムゾーン付き。例: 2025-04-04T19:00:00.000+09:00)"),
  // 将来の拡張フィールドはここに追加 (e.g. version, sequence)
});

export const ParseUuidsResultError = z.object({
  uuid: z.string(),
  error: z.string().describe("パース失敗の理由"),
});

export const ParseUuidsResult = z.union([
  ParseUuidsResultSuccess,
  ParseUuidsResultError,
]);

export const ParseUuidsOutput = z.object({
  results: z
    .array(ParseUuidsResult)
    .describe("入力と同じ順序で各UUIDのパース結果を返す"),
});

export type ParseUuidsInput = z.infer<typeof ParseUuidsInput>;
export type ParseUuidsResultSuccess = z.infer<typeof ParseUuidsResultSuccess>;
export type ParseUuidsResultError = z.infer<typeof ParseUuidsResultError>;
export type ParseUuidsResult = z.infer<typeof ParseUuidsResult>;
export type ParseUuidsOutput = z.infer<typeof ParseUuidsOutput>;
