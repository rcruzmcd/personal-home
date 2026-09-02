import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; href: string };

/**
 * Wayfinding trail for any page below a top-level section. Rendered above the
 * page title (never as a "Back to X" link below it, where it reads as a
 * subtitle) and deliberately quiet — `text-small text-muted` so it never
 * competes with the heading or the page's primary action.
 *
 * The current page is the last node and is not a link, since every other node
 * has to be somewhere the user can actually go.
 */
export function Breadcrumb({ trail, current }: { trail: BreadcrumbItem[]; current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-small text-muted">
        {trail.map((item) => (
          <li key={item.href} className="flex items-center gap-1">
            <Link href={item.href} className="hover:text-purple transition-colors duration-200">
              {item.label}
            </Link>
            <ChevronRight aria-hidden className="size-4" />
          </li>
        ))}
        <li aria-current="page" className="text-foreground">
          {current}
        </li>
      </ol>
    </nav>
  );
}
