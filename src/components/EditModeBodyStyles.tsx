import { useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";

const ADMIN_BAR_HEIGHT_MOBILE = "46px";
const ADMIN_BAR_HEIGHT_DESKTOP = "32px";
const EDIT_NOTICE_HEIGHT = "40px";

export default function EditModeBodyStyles() {
  const { isAdminAuthenticated, isAuthCheckComplete, isEditMode } = useAdmin();
  const showAdminBar = isAuthCheckComplete && isAdminAuthenticated;

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (showAdminBar) {
      root.style.setProperty("--admin-bar-height", ADMIN_BAR_HEIGHT_DESKTOP);
      body.classList.add("has-admin-bar");
    } else {
      root.style.removeProperty("--admin-bar-height");
      body.classList.remove("has-admin-bar");
    }

    if (isEditMode) {
      body.classList.add("edit-mode-active");
      root.style.setProperty("--edit-notice-height", EDIT_NOTICE_HEIGHT);
    } else {
      body.classList.remove("edit-mode-active");
      root.style.setProperty("--edit-notice-height", "0px");
    }

    return () => {
      root.style.removeProperty("--admin-bar-height");
      root.style.removeProperty("--edit-notice-height");
      body.classList.remove("has-admin-bar", "edit-mode-active");
    };
  }, [showAdminBar, isEditMode]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const applyHeight = () => {
      if (!showAdminBar) return;
      document.documentElement.style.setProperty(
        "--admin-bar-height",
        media.matches ? ADMIN_BAR_HEIGHT_MOBILE : ADMIN_BAR_HEIGHT_DESKTOP,
      );
    };

    applyHeight();
    media.addEventListener("change", applyHeight);
    return () => media.removeEventListener("change", applyHeight);
  }, [showAdminBar]);

  return null;
}
