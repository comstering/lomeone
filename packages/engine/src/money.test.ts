import { describe, expect, it } from "vitest";
import { clamp, floorToUnit } from "./money";

describe("clamp", () => {
  it("범위 안의 값은 그대로 둔다", () => {
    expect(clamp(5_000_000, 410_000, 6_590_000)).toBe(5_000_000);
  });

  it("하한·상한 밖의 값은 경계로 자른다", () => {
    expect(clamp(300_000, 410_000, 6_590_000)).toBe(410_000);
    expect(clamp(9_000_000, 410_000, 6_590_000)).toBe(6_590_000);
  });
});

describe("floorToUnit", () => {
  it("단위 미만을 절사한다", () => {
    expect(floorToUnit(12_345, 10)).toBe(12_340);
    expect(floorToUnit(12_340, 10)).toBe(12_340);
    expect(floorToUnit(6_589_999, 1_000)).toBe(6_589_000);
  });
});
