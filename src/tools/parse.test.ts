import { v7 as uuidv7 } from "uuid";
import { describe, expect, it } from "vitest";
import { parseUuids } from "./parse.js";

const VALID_UUID_V4 = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

describe("parseUuids", () => {
  it("UUID v7からタイムスタンプを抽出できる", () => {
    const uuid = uuidv7();
    const result = parseUuids({ uuids: [uuid] });
    expect("timestamp" in result.results[0]).toBe(true);
  });

  it("抽出したタイムスタンプはタイムゾーンオフセット付きのISO 8601形式である", () => {
    const uuid = uuidv7();
    const result = parseUuids({ uuids: [uuid] });
    if ("timestamp" in result.results[0]) {
      const { timestamp } = result.results[0];
      // ISO 8601 with timezone offset (e.g. 2025-04-04T19:00:00.000+09:00 or ...Z)
      const ISO8601_WITH_TZ =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}([+-]\d{2}:\d{2}|Z)$/;
      expect(timestamp).toMatch(ISO8601_WITH_TZ);
      expect(Number.isNaN(new Date(timestamp).getTime())).toBe(false);
    }
  });

  it("抽出したタイムスタンプはUUID生成時刻と一致する", () => {
    const before = Date.now();
    const uuid = uuidv7();
    const after = Date.now();

    const result = parseUuids({ uuids: [uuid] });
    if ("timestamp" in result.results[0]) {
      // タイムゾーンが異なっていても new Date() でエポックミリ秒に変換して比較
      const ts = new Date(result.results[0].timestamp).getTime();
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after);
    }
  });

  it("UUID v7以外はerrorを返す", () => {
    const result = parseUuids({ uuids: [VALID_UUID_V4] });
    expect("error" in result.results[0]).toBe(true);
  });

  it("不正な文字列はerrorを返す", () => {
    const result = parseUuids({ uuids: ["not-a-uuid"] });
    expect("error" in result.results[0]).toBe(true);
  });

  it("エラーが含まれても他のUUIDは処理を続ける", () => {
    const uuid = uuidv7();
    const result = parseUuids({ uuids: [uuid, "invalid", VALID_UUID_V4] });
    expect(result.results).toHaveLength(3);
    expect("timestamp" in result.results[0]).toBe(true);
    expect("error" in result.results[1]).toBe(true);
    expect("error" in result.results[2]).toBe(true);
  });

  it("結果は入力と同じ順序で返る", () => {
    const uuids = [uuidv7(), "invalid", uuidv7()];
    const result = parseUuids({ uuids });
    expect(result.results.map((r) => r.uuid)).toEqual(uuids);
  });
});
