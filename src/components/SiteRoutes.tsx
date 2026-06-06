import { Route, Routes } from "react-router-dom";
import { MarketingRoute } from "@/components/marketing/MarketingRoute";
import Index from "@/pages/Index";
import Advisory from "@/pages/Advisory";
import Mission from "@/pages/Mission";
import Insights from "@/pages/Insights";
import InsightArticle from "@/pages/InsightArticle";
import Applications from "@/pages/Applications";
import WhoBenefits from "@/pages/WhoBenefits";
import Apply from "@/pages/Apply";
import Admin from "@/pages/Admin";
import AdminAvailability from "@/pages/AdminAvailability";
import AdminSiteStudio from "@/pages/admin/AdminSiteStudio";
import AdminMediaLibrary from "@/pages/admin/AdminMediaLibrary";
import AdminServices from "@/pages/admin/AdminServices";
import AdminPageBuilder from "@/pages/admin/AdminPageBuilder";
import AdminVisualEditor from "@/pages/admin/AdminVisualEditor";
import AdminVisualBuilder from "@/pages/admin/AdminVisualBuilder";
import AdminPageEditorDashboard from "@/pages/admin/AdminPageEditorDashboard";
import AdminMarketingCanvasEditor from "@/pages/admin/AdminMarketingCanvasEditor";
import DynamicSitePage from "@/pages/DynamicSitePage";
import NotFound from "@/pages/NotFound";

export default function SiteRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MarketingRoute contentPage="home">
            <Index />
          </MarketingRoute>
        }
      />
      <Route
        path="/advisory"
        element={
          <MarketingRoute contentPage="advisory">
            <Advisory />
          </MarketingRoute>
        }
      />
      <Route
        path="/about"
        element={
          <MarketingRoute contentPage="mission">
            <Mission />
          </MarketingRoute>
        }
      />
      <Route
        path="/mission"
        element={
          <MarketingRoute contentPage="mission">
            <Mission />
          </MarketingRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <MarketingRoute contentPage="applications">
            <Applications />
          </MarketingRoute>
        }
      />
      <Route
        path="/who-benefits"
        element={
          <MarketingRoute contentPage="who_benefits">
            <WhoBenefits />
          </MarketingRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <MarketingRoute contentPage="insights">
            <Insights />
          </MarketingRoute>
        }
      />
      <Route
        path="/insights/:slug"
        element={
          <MarketingRoute contentPage="insight_article">
            <InsightArticle />
          </MarketingRoute>
        }
      />
      <Route
        path="/apply"
        element={
          <MarketingRoute contentPage="apply">
            <Apply />
          </MarketingRoute>
        }
      />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/availability" element={<AdminAvailability />} />
      <Route path="/admin/pages" element={<AdminPageEditorDashboard />} />
      <Route path="/admin/pages/canvas/:contentPage" element={<AdminMarketingCanvasEditor />} />
      <Route path="/admin/media" element={<AdminMediaLibrary />} />
      <Route path="/admin/services" element={<AdminServices />} />
      <Route path="/admin/site" element={<AdminSiteStudio />} />
      <Route path="/admin/site/page/:pageId" element={<AdminPageBuilder />} />
      <Route path="/admin/editor/:pageId" element={<AdminVisualEditor />} />
      <Route path="/admin/visual-builder/:pageId" element={<AdminVisualBuilder />} />
      <Route path="/pages/:slug" element={<DynamicSitePage />} />
      <Route
        path="*"
        element={
          <MarketingRoute contentPage="not_found">
            <NotFound />
          </MarketingRoute>
        }
      />
    </Routes>
  );
}
