import { ko } from "@/copy/ko";

// S-01 랜딩의 자리표시자. 샘플 곡선·CTA·계산기 카드는 랜딩 스토리에서 만든다.
export default function Home() {
  return (
    <div className="mx-auto max-w-page px-gutter py-16 lg:py-24">
      <h1 className="max-w-[18ch] text-3xl font-bold tracking-tight lg:text-4xl">
        {ko.home.heading}
      </h1>
      <p className="mt-4 max-w-prose text-ink-muted lg:text-lg">{ko.home.lead}</p>
    </div>
  );
}
