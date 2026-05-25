import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PageCanvasEditorProvider } from "@/contexts/PageCanvasEditorContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

/** PageCanvasEditorProvider calls useLocation — must be inside a Router. */
describe("PageCanvasEditorProvider", () => {
  it("renders inside MemoryRouter without throwing", () => {
    expect(() =>
      render(
        <LanguageProvider>
          <AdminProvider>
            <MemoryRouter initialEntries={["/"]}>
              <PageCanvasEditorProvider>
                <div data-testid="ok" />
              </PageCanvasEditorProvider>
            </MemoryRouter>
          </AdminProvider>
        </LanguageProvider>,
      ),
    ).not.toThrow();
  });
});
