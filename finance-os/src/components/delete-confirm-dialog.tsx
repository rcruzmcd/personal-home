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
  onConfirm,
}: {
  trigger: ReactNode;
  tooltipLabel?: string;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Escape / overlay-click dismiss call onOpenChange directly, bypassing
  // AlertDialogAction's onClick entirely — guard here too, not just there,
  // so the dialog can't be dismissed while the delete is still in flight.
  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setOpen(next);
  }

  function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
    // AlertDialogAction is Radix's DialogPrimitive.Close under the hood —
    // preventDefault suppresses its built-in auto-close so the dialog can
    // stay open with the overlay until the delete finishes.
    event.preventDefault();
    startTransition(async () => {
      try {
        await onConfirm();
      } finally {
        setOpen(false);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {tooltipLabel ? (
        <Tooltip>
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
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
        <LoadingOverlay show={isPending} className="rounded-xl" />
      </AlertDialogContent>
    </AlertDialog>
  );
}
