import Link from "next/link";
import { ko } from "@/copy/ko";
import { Logo } from "./Logo";

const navItems = [
  { href: "/calc", label: ko.nav.calculators },
  { href: "/sim", label: ko.nav.simulator },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between gap-4 px-gutter">
        <Link
          href="/"
          aria-label={ko.a11y.homeLink}
          className="flex items-center gap-2 text-base font-bold tracking-tight"
        >
          <Logo />
          <span aria-hidden="true">{ko.site.name}</span>
        </Link>

        <nav aria-label={ko.a11y.mainNav}>
          <ul className="flex items-center gap-1 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-control px-3 text-ink-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
