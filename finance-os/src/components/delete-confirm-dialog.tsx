"use client";

import { useState, useTransition, type MouseEvent, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LoadingOverlay } from "@/components/loading-overlay";

/**
 * Wraps a delete trigger button in a confirmation dialog that stays open
 * (showing a loading overlay) until `onConfirm` settles. `trigger` must be
 * a single DOM element (e.g. a `type="button"` button).
 */
export function DeleteConfirmDialog({
  trigger,
  tooltipLabel,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
}: {
  trigger: ReactNode;
  tooltipLabel?: string;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Escape / overlay-click dismiss call onOpenChange directly, bypassing
  // AlertDialogAction's onClick entirely — guard here too, not just there,
  // so the dialog can't be dismissed while the delete is still in flight.
  function handleOpenChange(next: boolean) {
    if (isPending) return;
    if (next) setError(null);
    setOpen(next);
  }

  function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
    // AlertDialogAction is Radix's DialogPrimitive.Close under the hood —
    // preventDefault suppresses its built-in auto-close so the dialog can
    // stay open with the overlay until the delete finishes.
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await onConfirm();
        setOpen(false);
      } catch {
        // Keep the dialog open with the failure visible. Letting the
        // rejection escape the transition instead surfaces as an app-level
        // error, which leaves the dialog's backdrop covering a page that no
        // longer responds to clicks.
        setError("That didn't go through. Nothing was deleted — try again.");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {tooltipLabel ? (
        // The tooltip is controlled and forced shut while the dialog is
        // open: a hover tooltip still mounted when a dialog takes over can
        // leave `pointer-events: none` stranded on <body>, which reads as
        // the whole page freezing behind the backdrop.
        <Tooltip open={tooltipOpen && !open} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{tooltipLabel}</TooltipContent>
        </Tooltip>
      ) : (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      )}
      <AlertDialogContent className="relative">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="callout" className="p-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
        <LoadingOverlay show={isPending} className="rounded-xl" />
      </AlertDialogContent>
    </AlertDialog>
  );
}
