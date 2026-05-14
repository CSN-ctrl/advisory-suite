-- Bookings + availability in Postgres; admin via JWT metadata, optional email allowlist table.

CREATE TABLE IF NOT EXISTS public.admin_email_allowlist (
  email text PRIMARY KEY
);

ALTER TABLE public.admin_email_allowlist ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.admin_email_allowlist FROM PUBLIC;
GRANT ALL ON public.admin_email_allowlist TO service_role;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' -> 'admin') = 'true'::jsonb, false)
      OR COALESCE((auth.jwt() -> 'user_metadata' -> 'admin') = 'true'::jsonb, false)
      OR EXISTS (
        SELECT 1
        FROM public.admin_email_allowlist a
        WHERE lower(a.email) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
          AND length(trim(coalesce(auth.jwt() ->> 'email', ''))) > 0
      );
$$;

CREATE TABLE IF NOT EXISTS public.availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  availability_date date NOT NULL,
  slot_id text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT availability_slots_times_nonempty_chk CHECK (
    length(trim(start_time)) >= 4 AND length(trim(end_time)) >= 4
  ),
  UNIQUE (availability_date, slot_id)
);

CREATE INDEX IF NOT EXISTS availability_slots_date_idx ON public.availability_slots (availability_date);

ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "availability_slots read all" ON public.availability_slots;
CREATE POLICY "availability_slots read all"
  ON public.availability_slots FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "availability_slots insert admin" ON public.availability_slots;
CREATE POLICY "availability_slots insert admin"
  ON public.availability_slots FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "availability_slots update admin" ON public.availability_slots;
CREATE POLICY "availability_slots update admin"
  ON public.availability_slots FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "availability_slots delete admin" ON public.availability_slots;
CREATE POLICY "availability_slots delete admin"
  ON public.availability_slots FOR DELETE
  USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL,
  service_name text NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  booking_date date NOT NULL,
  slot_id text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  payment_type text NOT NULL CHECK (payment_type IN ('deposit', 'full')),
  amount_paid numeric(12, 2) NOT NULL CHECK (amount_paid >= 0),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_date_idx ON public.bookings (booking_date);
CREATE INDEX IF NOT EXISTS bookings_slot_idx ON public.bookings (booking_date, slot_id);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings read admin" ON public.bookings;
CREATE POLICY "bookings read admin"
  ON public.bookings FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "bookings insert if slot free" ON public.bookings;
CREATE POLICY "bookings insert if slot free"
  ON public.bookings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.availability_slots a
      WHERE a.availability_date = booking_date
        AND a.slot_id = slot_id
    )
    AND NOT EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.booking_date = booking_date
        AND b.slot_id = slot_id
        AND b.status IS DISTINCT FROM 'cancelled'
    )
  );

DROP POLICY IF EXISTS "site_content admin insert" ON public.site_content;
CREATE POLICY "site_content admin insert"
  ON public.site_content FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_content admin update" ON public.site_content;
CREATE POLICY "site_content admin update"
  ON public.site_content FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_content_admin_delete" ON public.site_content;
CREATE POLICY "site_content_admin_delete"
  ON public.site_content FOR DELETE
  USING (public.is_admin());

REVOKE INSERT, UPDATE, DELETE ON public.site_content FROM anon;
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;

GRANT SELECT ON public.availability_slots TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.availability_slots TO authenticated;

REVOKE ALL ON public.bookings FROM PUBLIC;
GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT ON public.bookings TO authenticated;

-- Public booking UI: open dates/slots without exposing booking rows to anon.
CREATE OR REPLACE FUNCTION public.get_available_booking_dates()
RETURNS TABLE(available_date date)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT a.availability_date
  FROM public.availability_slots a
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.booking_date = a.availability_date
      AND b.slot_id = a.slot_id
      AND b.status IS DISTINCT FROM 'cancelled'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_available_slots_for_booking(p_date date)
RETURNS TABLE(slot_id text, start_time text, end_time text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.slot_id, a.start_time, a.end_time
  FROM public.availability_slots a
  WHERE a.availability_date = p_date
    AND NOT EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.booking_date = a.availability_date
        AND b.slot_id = a.slot_id
        AND b.status IS DISTINCT FROM 'cancelled'
    )
  ORDER BY a.start_time;
$$;

REVOKE ALL ON FUNCTION public.get_available_booking_dates() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_available_booking_dates() TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_available_slots_for_booking(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_available_slots_for_booking(date) TO anon, authenticated;
