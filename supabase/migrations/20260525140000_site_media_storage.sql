-- Public media bucket for inline editor image uploads.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "site_media public read" ON storage.objects;
CREATE POLICY "site_media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "site_media admin insert" ON storage.objects;
CREATE POLICY "site_media admin insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-media' AND public.is_admin());

DROP POLICY IF EXISTS "site_media admin update" ON storage.objects;
CREATE POLICY "site_media admin update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'site-media' AND public.is_admin());

DROP POLICY IF EXISTS "site_media admin delete" ON storage.objects;
CREATE POLICY "site_media admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-media' AND public.is_admin());
