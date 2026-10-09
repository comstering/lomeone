// 룰셋 스키마(zod)와 KR 시드 데이터는 US-003에서 추가한다 (PRD §11).

export type Country = "KR";

/** 룰셋의 모든 수치 필드는 출처와 확인일을 가진다 (FR-10). */
export interface Sourced<T> {
  value: T;
  source: string | null;
  /** YYYY-MM-DD. null이면 프로덕션 빌드가 실패한다. */
  verifiedAt: string | null;
}
