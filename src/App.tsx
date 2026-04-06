import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Advisory from "./pages/Advisory";
import Mission from "./pages/Mission";
import Insights from "./pages/Insights";
import InsightArticle from "./pages/InsightArticle";
import Applications from "./pages/Applications";
import WhoBenefits from "./pages/WhoBenefits";
import Apply from "./pages/Apply";
import AdminAvailability from "./pages/AdminAvailability";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/advisory" element={<Advisory />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/who-benefits" element={<WhoBenefits />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightArticle />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/admin/availability" element={<AdminAvailability />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
