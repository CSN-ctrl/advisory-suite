import { Navigate } from "react-router-dom";

/** @deprecated Use /admin/pages — kept for backward-compatible links. */
const AdminSiteStudio = () => <Navigate to="/admin/pages?tab=custom" replace />;

export default AdminSiteStudio;
