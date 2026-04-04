import { describe, expect, it } from "vitest";
import { validateUuids } from "./validate.js";

const VALID_UUID_V7 = "019729ab-1234-7abc-89de-123456789012";
const VALID_UUID_V4 = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

describe("validateUuids", () => {
  it("有効なUUID v7はvalid: trueを返す", () => {
    const result = validateUuids({ uuids: [VALID_UUID_V7] });
    expect(result.results[0]).toEqual({ uuid: VALID_UUID_V7, valid: true });
  });

  it("有効なUUID v4もvalid: trueを返す（形式チェックのみ）", () => {
    const result = validateUuids({ uuids: [VALID_UUID_V4] });
    expect(result.results[0]).toEqual({ uuid: VALID_UUID_V4, valid: true });
  });

  it("不正な文字列はvalid: falseとreasonを返す", () => {
    const uuid = "not-a-uuid";
    const result = validateUuids({ uuids: [uuid] });
    expect(result.results[0].uuid).toBe(uuid);
    expect(result.results[0].valid).toBe(false);
    if (!result.results[0].valid) {
      expect(result.results[0].reason).toBeTruthy();
    }
  });

  it("結果は入力と同じ順序で返る", () => {
    const uuids = ["invalid-1", VALID_UUID_V7, "invalid-2"];
    const result = validateUuids({ uuids });
    expect(result.results.map((r) => r.uuid)).toEqual(uuids);
  });

  it("有効・無効が混在していても全件処理する", () => {
    const uuids = [VALID_UUID_V7, "bad", VALID_UUID_V4];
    const result = validateUuids({ uuids });
    expect(result.results).toHaveLength(3);
    expect(result.results[0].valid).toBe(true);
    expect(result.results[1].valid).toBe(false);
    expect(result.results[2].valid).toBe(true);
  });
});
