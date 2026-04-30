export function requireAdmin(req, res, next) {
  if (!req.session?.admin || req.session.admin.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
}
