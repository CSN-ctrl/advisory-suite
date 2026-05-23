import { useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";

function isAllowedEditInteraction(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest('[data-edit-allow="true"], [data-editable-region="true"]'));
}

/**
 * In WordPress-style edit mode, navigation stays enabled. We only guard
 * accidental form submits outside explicit edit controls.
 */
export default function EditModeInteractionGuard() {
  const { isEditMode } = useAdmin();

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const handleSubmitCapture = (event: SubmitEvent) => {
      const target = event.target;
      if (isAllowedEditInteraction(target)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("submit", handleSubmitCapture, true);

    return () => {
      document.removeEventListener("submit", handleSubmitCapture, true);
    };
  }, [isEditMode]);

  return null;
}
