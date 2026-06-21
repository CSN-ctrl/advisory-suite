import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { isFullscreenAdminEditorRoute } from "@/components/AdminChrome";

const CONSENT_KEY = "cookie_consent";

export function CookieConsent() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CONSENT_KEY);
    setVisible(!stored);
  }, []);

  if (!visible || isFullscreenAdminEditorRoute(pathname)) {
    return null;
  }

  const accept = () => {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[90] border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur-md sm:p-5"
    >
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl font-body text-sm text-muted-foreground leading-relaxed">
          We use essential cookies and local storage to run this site (e.g. preferences and admin session).
          See our{" "}
          <Link to="/privacy" className="text-primary underline hover:text-primary/90">
            Privacy Policy
          </Link>{" "}
          for details on GDPR and data processing.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="gold" size="sm" onClick={accept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
