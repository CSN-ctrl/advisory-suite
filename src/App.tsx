import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditModeAdminBar from "@/components/EditModeAdminBar";
import EditModeBodyStyles from "@/components/EditModeBodyStyles";
import EditModeInteractionGuard from "@/components/EditModeInteractionGuard";
import EditModeNotice from "@/components/EditModeNotice";
import { isFullscreenAdminEditorRoute } from "@/components/AdminChrome";
import SiteRoutes from "@/components/SiteRoutes";
import { AdminProvider } from "@/contexts/AdminContext";
import { PageCanvasEditorProvider } from "@/contexts/PageCanvasEditorContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

function AppChrome() {
  const { pathname } = useLocation();
  const fullscreenEditor = isFullscreenAdminEditorRoute(pathname);

  return (
    <>
      {!fullscreenEditor ? (
        <>
          <EditModeBodyStyles />
          <EditModeInteractionGuard />
          <EditModeAdminBar />
          <EditModeNotice />
          <Header />
        </>
      ) : null}
      <SiteRoutes />
      {!fullscreenEditor ? <Footer /> : null}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AdminProvider>
          <PageCanvasEditorProvider>
            <BrowserRouter>
              <AppChrome />
            </BrowserRouter>
          </PageCanvasEditorProvider>
        </AdminProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
