import { describe, expect, it } from "vitest";
import { generateUuids } from "./generate.js";

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("generateUuids", () => {
  it("countを省略すると1件返す", () => {
    const result = generateUuids({});
    expect(result.uuids).toHaveLength(1);
  });

  it("count=1のときも配列で返す", () => {
    const result = generateUuids({ count: 1 });
    expect(Array.isArray(result.uuids)).toBe(true);
  });

  it("指定したcount分のUUIDを返す", () => {
    const result = generateUuids({ count: 5 });
    expect(result.uuids).toHaveLength(5);
  });

  it("生成されたUUIDはすべてv7形式である", () => {
    const result = generateUuids({ count: 10 });
    for (const uuid of result.uuids) {
      expect(uuid).toMatch(UUID_V7_REGEX);
    }
  });

  it("生成されたUUIDはすべて一意である", () => {
    const result = generateUuids({ count: 100 });
    const unique = new Set(result.uuids);
    expect(unique.size).toBe(100);
  });
});
