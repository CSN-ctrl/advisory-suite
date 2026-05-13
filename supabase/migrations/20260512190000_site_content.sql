-- Content store for inline admin editing.
create table if not exists public.site_content (
  page text not null,
  section text not null,
  key text not null,
  locale text not null default 'en',
  value text not null default '',
  updated_by text,
  updated_at timestamptz not null default now(),
  primary key (page, section, key, locale)
);

create index if not exists site_content_page_locale_idx
  on public.site_content (page, locale);

alter table public.site_content enable row level security;

-- Public read so the marketing site can render content without auth.
drop policy if exists "site_content public read" on public.site_content;
create policy "site_content public read"
  on public.site_content
  for select
  using (true);

-- Writes are only allowed via the service role from the serverless API.
-- No anon/authenticated INSERT/UPDATE/DELETE policy is granted.
