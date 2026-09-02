import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/**
 * The standard top of an app screen: breadcrumb → title → supporting line,
 * with the page's key numbers and its actions on the opposite end of the
 * title row. Every screen uses this so location, headline figures and the
 * primary action are always in the same place (see docs/UX_PATTERNS.md).
 *
 * `stats` and `actions` are slots rather than data props — a header shouldn't
 * need to know how a page's numbers are computed or where its buttons go.
 *
 * `compact` drops the title to h2 for the narrow single-column form screens,
 * where the 48px page title would outweigh the form it introduces.
 */
export function PageHeader({
  title,
  breadcrumb,
  description,
  stats,
  actions,
  compact = false,
}: {
  title: string;
  breadcrumb?: BreadcrumbItem[];
  description?: ReactNode;
  stats?: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
}) {
  return (
    <header className="flex flex-col gap-3">
      {breadcrumb && breadcrumb.length > 0 && <Breadcrumb trail={breadcrumb} current={title} />}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <h1
            className={cn(
              "text-purple",
              compact ? "text-h2 font-semibold" : "text-h1 font-bold",
            )}
          >
            {title}
          </h1>
          {description && <p className="text-small text-muted">{description}</p>}
        </div>
        {(stats || actions) && (
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            {stats}
            {/* Actions sit last, and the primary one last within them — one
                primary per header, always in the same corner. */}
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
