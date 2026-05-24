import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditModeInteractionGuard from "@/components/EditModeInteractionGuard";
import Index from "./pages/Index";
import Advisory from "./pages/Advisory";
import Mission from "./pages/Mission";
import Insights from "./pages/Insights";
import InsightArticle from "./pages/InsightArticle";
import Applications from "./pages/Applications";
import WhoBenefits from "./pages/WhoBenefits";
import Apply from "./pages/Apply";
import Admin from "./pages/Admin";
import AdminAvailability from "./pages/AdminAvailability";
import AdminSiteStudio from "./pages/admin/AdminSiteStudio";
import AdminPageBuilder from "./pages/admin/AdminPageBuilder";
import DynamicSitePage from "./pages/DynamicSitePage";
import NotFound from "./pages/NotFound";
import { AdminProvider } from "@/contexts/AdminContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AdminProvider>
          <BrowserRouter>
            <EditModeInteractionGuard />
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/advisory" element={<Advisory />} />
              <Route path="/about" element={<Mission />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/who-benefits" element={<WhoBenefits />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/insights/:slug" element={<InsightArticle />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/availability" element={<AdminAvailability />} />
              <Route path="/admin/site" element={<AdminSiteStudio />} />
              <Route path="/admin/site/page/:pageId" element={<AdminPageBuilder />} />
              <Route path="/pages/:slug" element={<DynamicSitePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </AdminProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
