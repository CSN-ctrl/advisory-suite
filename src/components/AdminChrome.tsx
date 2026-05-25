import { useLocation } from "react-router-dom";

/** Routes that use the full-screen admin editor (no public header/footer or live canvas overlay). */
export function isFullscreenAdminEditorRoute(pathname: string): boolean {
  return (
    pathname === "/admin/pages" ||
    pathname.startsWith("/admin/pages/canvas/") ||
    pathname.startsWith("/admin/editor/")
  );
}

export function useFullscreenAdminEditorRoute(): boolean {
  const { pathname } = useLocation();
  return isFullscreenAdminEditorRoute(pathname);
}
