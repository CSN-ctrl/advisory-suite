-- Snapshots of site_pages.blocks before each content save (version history).

create table if not exists public.site_page_revisions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.site_pages (id) on delete cascade,
  revision_number int not null,
  blocks jsonb not null,
  title text not null default '',
  published boolean not null default false,
  editor text not null default 'blocks',
  created_by text,
  created_at timestamptz not null default now(),
  constraint site_page_revisions_page_revision_unique unique (page_id, revision_number),
  constraint site_page_revisions_editor_chk check (editor in ('blocks', 'canvas', 'visual-tree'))
);

create index if not exists site_page_revisions_page_created_idx
  on public.site_page_revisions (page_id, created_at desc);

alter table public.site_page_revisions enable row level security;

drop policy if exists "site_page_revisions select admin" on public.site_page_revisions;
create policy "site_page_revisions select admin"
  on public.site_page_revisions for select
  using (public.is_admin());

drop policy if exists "site_page_revisions insert admin" on public.site_page_revisions;
create policy "site_page_revisions insert admin"
  on public.site_page_revisions for insert
  with check (public.is_admin());

drop policy if exists "site_page_revisions delete admin" on public.site_page_revisions;
create policy "site_page_revisions delete admin"
  on public.site_page_revisions for delete
  using (public.is_admin());

grant select, insert, delete on public.site_page_revisions to authenticated;
