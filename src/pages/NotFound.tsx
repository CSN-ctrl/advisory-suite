import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePageEditing } from "@/hooks/use-page-editing";
import { CmsText } from "@/components/edit-mode/CmsText";
import { EditableNavLink } from "@/components/edit-mode/EditableNavLink";

const NotFound = () => {
  const location = useLocation();
  const { bind, getText, save, isAdminAuthenticated, isEditMode } = usePageEditing("shared");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const homeLink = getText("notFound", "homeLink", "/");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <CmsText
          as="h1"
          {...bind("notFound", "code", "404")}
          className="mb-4 text-4xl font-bold"
        />
        <CmsText
          as="p"
          {...bind("notFound", "message", "Oops! Page not found")}
          className="mb-4 text-xl text-muted-foreground"
        />
        <EditableNavLink
          to={homeLink}
          label={getText("notFound", "homeLinkLabel", "Return to Home")}
          isAdmin={isAdminAuthenticated}
          isEditMode={isEditMode}
          onSave={save("notFound", "homeLinkLabel")}
          fieldLabel="notFound.homeLinkLabel"
          className="text-primary underline hover:text-primary/90"
        />
        {isAdminAuthenticated && isEditMode ? (
          <CmsText
            as="p"
            {...bind("notFound", "homeLink", "/")}
            className="mt-2 font-mono text-[10px] text-muted-foreground"
          />
        ) : null}
      </div>
    </div>
  );
};

export default NotFound;
