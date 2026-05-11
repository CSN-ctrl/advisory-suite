import { useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";

function isAllowedEditInteraction(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest('[data-edit-allow="true"]'));
}

export default function EditModeInteractionGuard() {
  const { isEditMode } = useAdmin();

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const handleClickCapture = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (isAllowedEditInteraction(target)) {
        return;
      }

      const interactiveTarget = target.closest("a, button");
      if (interactiveTarget) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleSubmitCapture = (event: SubmitEvent) => {
      const target = event.target;
      if (isAllowedEditInteraction(target)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("click", handleClickCapture, true);
    document.addEventListener("submit", handleSubmitCapture, true);

    return () => {
      document.removeEventListener("click", handleClickCapture, true);
      document.removeEventListener("submit", handleSubmitCapture, true);
    };
  }, [isEditMode]);

  return null;
}
