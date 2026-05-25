import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditModeAdminBar from "@/components/EditModeAdminBar";
import EditModeBodyStyles from "@/components/EditModeBodyStyles";
import EditModeInteractionGuard from "@/components/EditModeInteractionGuard";
import EditModeNotice from "@/components/EditModeNotice";
import SiteRoutes from "@/components/SiteRoutes";
import { AdminProvider } from "@/contexts/AdminContext";
import { PageCanvasEditorProvider } from "@/contexts/PageCanvasEditorContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AdminProvider>
          <PageCanvasEditorProvider>
            <BrowserRouter>
              <EditModeBodyStyles />
              <EditModeInteractionGuard />
              <EditModeAdminBar />
              <EditModeNotice />
              <Header />
              <SiteRoutes />
              <Footer />
            </BrowserRouter>
          </PageCanvasEditorProvider>
        </AdminProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
