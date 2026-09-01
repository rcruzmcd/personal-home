"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Tracks whether a form has been changed by the user. Attach the returned
 * `ref` to the `<form>` element — dirty state is derived from bubbled
 * `input`/`change` events rather than per-field wiring, since these forms
 * are uncontrolled (`useActionState` + native `<form action>`).
 */
export function useDirtyFormTracking() {
  const [isDirty, setIsDirty] = useState(false);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = ref.current;
    if (!form) return;
    const markDirty = () => setIsDirty(true);
    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);
    return () => {
      form.removeEventListener("input", markDirty);
      form.removeEventListener("change", markDirty);
    };
  }, []);

  return { ref, isDirty };
}

/**
 * Warns before the user loses unsaved changes: intercepts clicks on
 * same-origin links (e.g. sidebar nav) while `isDirty` is true and shows a
 * confirmation before navigating, and asks the browser to confirm on tab
 * close/refresh. Does not intercept the browser back/forward buttons —
 * Next.js App Router client-side routing doesn't expose a cancelable
 * navigation event for that case.
 */
export function useUnsavedChangesGuard(isDirty: boolean) {
  const router = useRouter();
  const isDirtyRef = useRef(isDirty);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!isDirtyRef.current) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor || !anchor.href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname + url.search === window.location.pathname + window.location.search) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      setPendingHref(url.pathname + url.search);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  const confirmLeave = useCallback(() => {
    if (!pendingHref) return;
    isDirtyRef.current = false;
    router.push(pendingHref);
    setPendingHref(null);
  }, [pendingHref, router]);

  const cancelLeave = useCallback(() => {
    setPendingHref(null);
  }, []);

  return { isConfirmOpen: pendingHref !== null, confirmLeave, cancelLeave };
}
