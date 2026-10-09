/** 원 단위 정수 금액 */
export type Won = number;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** unit 미만 절사. 예: floorToUnit(12_345, 10) → 12_340 (보험료 10원 미만 절사) */
export function floorToUnit(value: Won, unit: number): Won {
  return Math.floor(value / unit) * unit;
}
