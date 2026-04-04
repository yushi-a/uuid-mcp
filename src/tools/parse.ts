import { validate, version } from "uuid";
import { ParseUuidsInput, ParseUuidsOutput } from "../schemas/parse.js";

function toLocalISOString(date: Date): string {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(offsetMinutes);
  const hh = String(Math.floor(absMinutes / 60)).padStart(2, "0");
  const mm = String(absMinutes % 60).padStart(2, "0");
  const pad = (n: number) => String(n).padStart(2, "0");
  const pad3 = (n: number) => String(n).padStart(3, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `.${pad3(date.getMilliseconds())}${sign}${hh}:${mm}`
  );
}

function extractTimestampMs(uuid: string): number {
  // UUID v7の最初の48ビット (12桁の16進数) がUnixタイムスタンプ (ミリ秒)
  return parseInt(uuid.replace(/-/g, "").slice(0, 12), 16);
}

export function parseUuids(input: ParseUuidsInput): ParseUuidsOutput {
  const { uuids } = ParseUuidsInput.parse(input);
  const results = uuids.map((uuid) => {
    if (!validate(uuid)) {
      return { uuid, error: "invalid UUID format" };
    }
    if (version(uuid) !== 7) {
      return { uuid, error: `not a UUID v7 (got v${version(uuid)})` };
    }
    const timestamp = toLocalISOString(new Date(extractTimestampMs(uuid)));
    return { uuid, timestamp };
  });
  return { results };
}
