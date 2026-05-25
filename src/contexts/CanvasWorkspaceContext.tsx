import { createContext, useContext, type ReactNode } from "react";

const CanvasWorkspaceContext = createContext(false);

export function CanvasWorkspaceProvider({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <CanvasWorkspaceContext.Provider value={active}>{children}</CanvasWorkspaceContext.Provider>
  );
}

export function useCanvasWorkspace(): boolean {
  return useContext(CanvasWorkspaceContext);
}
