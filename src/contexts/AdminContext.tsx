import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface AdminContextValue {
  isAdminAuthenticated: boolean;
  isEditMode: boolean;
  isAuthCheckComplete: boolean;
  setAdminAuthenticated: (isAuthenticated: boolean) => void;
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
}

const ADMIN_EDIT_MODE_STORAGE_KEY = "admin_edit_mode";

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

function getStoredBoolean(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(key) === "true";
}

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(() =>
    getStoredBoolean(ADMIN_EDIT_MODE_STORAGE_KEY),
  );

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/admin/me", {
          method: "GET",
          credentials: "include",
        });

        setIsAdminAuthenticated(response.ok);
        if (!response.ok) {
          setIsEditMode(false);
          window.localStorage.setItem(ADMIN_EDIT_MODE_STORAGE_KEY, "false");
        }
      } catch {
        setIsAdminAuthenticated(false);
        setIsEditMode(false);
        window.localStorage.setItem(ADMIN_EDIT_MODE_STORAGE_KEY, "false");
      } finally {
        setIsAuthCheckComplete(true);
      }
    };

    void verifySession();
  }, []);

  const setAdminAuthenticated = useCallback((isAuthenticated: boolean) => {
    setIsAdminAuthenticated(isAuthenticated);

    // Edit mode is only valid while an admin is authenticated.
    if (!isAuthenticated) {
      setIsEditMode(false);
      window.localStorage.setItem(ADMIN_EDIT_MODE_STORAGE_KEY, "false");
    }
  }, []);

  const setEditMode = useCallback((enabled: boolean) => {
    const nextValue = isAdminAuthenticated ? enabled : false;
    setIsEditMode(nextValue);
    window.localStorage.setItem(ADMIN_EDIT_MODE_STORAGE_KEY, String(nextValue));
  }, [isAdminAuthenticated]);

  const toggleEditMode = useCallback(() => {
    setEditMode(!isEditMode);
  }, [isEditMode, setEditMode]);

  const value = useMemo<AdminContextValue>(
    () => ({
      isAdminAuthenticated,
      isEditMode,
      isAuthCheckComplete,
      setAdminAuthenticated,
      toggleEditMode,
      setEditMode,
    }),
    [isAdminAuthenticated, isEditMode, isAuthCheckComplete, setAdminAuthenticated, toggleEditMode, setEditMode],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return context;
};
