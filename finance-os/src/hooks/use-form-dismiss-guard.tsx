"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Lets a form report its unsaved state to whatever is hosting it.
 *
 * useUnsavedChangesGuard protects a form *page* by intercepting anchor clicks.
 * A sheet is dismissed by Escape, a click on the overlay, or the close button —
 * none of which are anchors — so a form moved into a sheet would silently
 * discard edits. The host subscribes here instead, and the hook publishes into
 * it automatically, so no form component has to know which shell it is in.
 *
 * Outside a host the context is absent and every form behaves exactly as before.
 */
type DirtyReporter = (isDirty: boolean) => void;

const FormDismissContext = createContext<DirtyReporter | null>(null);

export function useReportDirty(): DirtyReporter | null {
  return useContext(FormDismissContext);
}

/**
 * Host side: tracks whether the contained form is dirty and turns a dismissal
 * attempt into either an immediate close or a confirmation prompt.
 *
 * Dismissal is decided in one place. Radix fires a preventable event first
 * (Escape, outside pointer) and then `onOpenChange`, so the preventable
 * handlers only *block* a dirty form — they never dismiss. Otherwise a clean
 * dismissal would run twice, and the two `router.back()` calls fight.
 */
export function useFormDismissGuard(onDismiss: () => void) {
  const isDirtyRef = useRef(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const reportDirty = useCallback<DirtyReporter>((isDirty) => {
    isDirtyRef.current = isDirty;
  }, []);

  /** Attach to every preventable dismissal event: holds a dirty form open and asks. */
  const blockIfDirty = useCallback((event: { preventDefault: () => void }) => {
    if (!isDirtyRef.current) return;
    event.preventDefault();
    setIsConfirmOpen(true);
  }, []);

  /**
   * Attach to onOpenChange. A dirty form has already been intercepted above, so
   * reaching here while dirty means a path that wasn't preventable — ask rather
   * than lose the edits.
   */
  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) return;
      if (isDirtyRef.current) {
        setIsConfirmOpen(true);
        return;
      }
      onDismiss();
    },
    [onDismiss],
  );

  const confirmDismiss = useCallback(() => {
    isDirtyRef.current = false;
    setIsConfirmOpen(false);
    onDismiss();
  }, [onDismiss]);

  const cancelDismiss = useCallback(() => setIsConfirmOpen(false), []);

  const Provider = useCallback(
    ({ children }: { children: ReactNode }) => (
      <FormDismissContext.Provider value={reportDirty}>{children}</FormDismissContext.Provider>
    ),
    [reportDirty],
  );

  return useMemo(
    () => ({
      Provider,
      blockIfDirty,
      handleOpenChange,
      confirmDismiss,
      cancelDismiss,
      isConfirmOpen,
    }),
    [Provider, blockIfDirty, handleOpenChange, confirmDismiss, cancelDismiss, isConfirmOpen],
  );
}
