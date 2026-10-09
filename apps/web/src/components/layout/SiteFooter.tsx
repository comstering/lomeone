import Link from "next/link";
import { ko } from "@/copy/ko";

const footerLinks = [
  { href: "/legal/disclaimer", label: ko.footer.disclaimer },
  { href: "/legal/privacy", label: ko.footer.privacy },
  { href: "/legal/terms", label: ko.footer.terms },
  { href: "/about/assumptions", label: ko.footer.assumptions },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule">
      <div className="mx-auto max-w-page px-gutter py-8 text-sm text-ink-muted">
        <nav aria-label={ko.a11y.footerNav}>
          <ul className="-mx-2 flex flex-wrap gap-x-1 gap-y-1">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-control px-2 underline-offset-4 hover:text-ink hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-4 max-w-prose">{ko.footer.notice}</p>
      </div>
    </footer>
  );
}
