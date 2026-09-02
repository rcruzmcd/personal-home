import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import type { BreadcrumbItem } from "@/components/ui/breadcrumb";

/**
 * Layout for the single-form screens (add/edit an account, transaction,
 * income source, rule…). The title moves out of the card and becomes a real
 * page heading with a breadcrumb above it: the trail says where the form sits
 * and doubles as its way out, which these screens otherwise lacked — the
 * browser Back button was the only exit.
 */
export function FormPage({
  title,
  breadcrumb,
  description,
  children,
}: {
  title: string;
  breadcrumb: BreadcrumbItem[];
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="flex-1 flex flex-col items-center gap-6 px-10 py-16">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <PageHeader compact title={title} breadcrumb={breadcrumb} description={description} />
        <Card>{children}</Card>
      </div>
    </main>
  );
}
