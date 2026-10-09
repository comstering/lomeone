/** 워드마크 앞의 곡선 글리프: 오르다가 은퇴 뒤 완만히 내려오는 자산 곡선 */
export function Logo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 20"
      className="h-5 w-8 shrink-0 text-gain"
      fill="none"
    >
      <path d="M1 18 L31 18" className="stroke-rule" strokeWidth="1.5" />
      <path
        d="M2 17 C 9 16, 13 4, 20 3 S 28 9, 30 12"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <circle cx="20" cy="3" r="1.75" fill="currentColor" />
    </svg>
  );
}
