import { useEffect } from "react";

/** Warn before closing the tab when there are unsaved editor changes. */
export function useUnsavedChangesGuard(dirty: boolean, message = "You have unsaved changes.") {
  useEffect(() => {
    if (!dirty) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, message]);
}
