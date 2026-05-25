import { Route, Routes } from "react-router-dom";
import { FullPageCanvasEditor } from "@/components/page-editor/FullPageCanvasEditor";
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
import AdminPageBuilder from "@/pages/admin/AdminPageBuilder";
import AdminVisualEditor from "@/pages/admin/AdminVisualEditor";
import DynamicSitePage from "@/pages/DynamicSitePage";
import NotFound from "@/pages/NotFound";

/** Marketing and admin routes wrapped with full-page canvas editor when edit mode is on. */
export default function SiteRoutes() {
  return (
    <FullPageCanvasEditor>
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
        <Route path="/admin/editor/:pageId" element={<AdminVisualEditor />} />
        <Route path="/pages/:slug" element={<DynamicSitePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </FullPageCanvasEditor>
  );
}
