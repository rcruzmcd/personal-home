"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";
import { useFormDismissGuard } from "@/hooks/use-form-dismiss-guard";

/**
 * The sheet counterpart to FormPage, used by the intercepted add/edit routes.
 *
 * Rendering *is* opening: this only mounts when its route is intercepted over
 * the page behind it, so `open` is always true and dismissal means leaving the
 * route — `router.back()`, the documented way to close an intercepted modal.
 *
 * There is no breadcrumb: FormPage's trail exists because a form page's only
 * other exit was the browser Back button, and a sheet already has an X, the
 * overlay, and Escape.
 */
export function FormSheet({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const { Provider, blockIfDirty, handleOpenChange, confirmDismiss, cancelDismiss, isConfirmOpen } =
    useFormDismissGuard(() => router.back());

  return (
    <>
      <Sheet open onOpenChange={handleOpenChange}>
        <SheetContent
          size="form"
          // These only hold a dirty form open and raise the prompt; the actual
          // dismissal happens once, in onOpenChange.
          onEscapeKeyDown={blockIfDirty}
          onPointerDownOutside={blockIfDirty}
          onInteractOutside={blockIfDirty}
          className="gap-0"
        >
          <div className="flex flex-col gap-1 pr-8">
            <SheetTitle>{title}</SheetTitle>
            {description && <p className="text-small text-muted">{description}</p>}
          </div>
          {/* The form scrolls, not the sheet: the title stays put while a long
              form (transactions) moves under it. */}
          <div className="-mx-6 mt-4 flex-1 overflow-y-auto px-6">
            <Provider>{children}</Provider>
          </div>
        </SheetContent>
      </Sheet>
      <UnsavedChangesDialog
        open={isConfirmOpen}
        onConfirm={confirmDismiss}
        onCancel={cancelDismiss}
      />
    </>
  );
}
