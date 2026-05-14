-- Allow the browser (anon/authenticated JWT) to call is_admin() for UI gating.
-- RLS policies still evaluate is_admin() internally; this only exposes explicit RPC.
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
