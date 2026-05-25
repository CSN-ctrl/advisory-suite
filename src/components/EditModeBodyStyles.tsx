import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { isMarketingRoute } from "@/lib/marketing-canvas";

const ADMIN_BAR_HEIGHT_MOBILE = "48px";
const ADMIN_BAR_HEIGHT_DESKTOP = "40px";
const EDIT_NOTICE_HEIGHT = "40px";
const CANVAS_HINT_HEIGHT = "36px";
const CANVAS_TOOLBAR_HEIGHT = "64px";

export default function EditModeBodyStyles() {
  const location = useLocation();
  const { isAdminAuthenticated, isAuthCheckComplete, isEditMode } = useAdmin();
  const showAdminBar = isAuthCheckComplete && isAdminAuthenticated;
  const canvasToolbar = isEditMode && isMarketingRoute(location.pathname);

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
      root.style.setProperty(
        "--edit-notice-height",
        canvasToolbar ? CANVAS_HINT_HEIGHT : EDIT_NOTICE_HEIGHT,
      );
    } else {
      body.classList.remove("edit-mode-active");
      root.style.setProperty("--edit-notice-height", "0px");
    }

    if (canvasToolbar) {
      body.classList.add("has-canvas-toolbar");
      root.style.setProperty("--canvas-toolbar-height", CANVAS_TOOLBAR_HEIGHT);
    } else {
      body.classList.remove("has-canvas-toolbar");
      root.style.removeProperty("--canvas-toolbar-height");
    }

    return () => {
      root.style.removeProperty("--admin-bar-height");
      root.style.removeProperty("--edit-notice-height");
      root.style.removeProperty("--canvas-toolbar-height");
      body.classList.remove("has-admin-bar", "edit-mode-active", "has-canvas-toolbar");
    };
  }, [showAdminBar, isEditMode, canvasToolbar]);

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
