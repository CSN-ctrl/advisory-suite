-- Services catalog: bookable offerings with per-locale copy.

create table if not exists public.services (
  id text primary key,
  sort_order int not null default 0,
  price_amount numeric(12, 2),
  price_display text,
  is_apply boolean not null default false,
  is_active boolean not null default true,
  bookable boolean not null default true,
  updated_by text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint services_id_format_chk check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create table if not exists public.service_translations (
  service_id text not null references public.services (id) on delete cascade,
  locale text not null default 'en',
  title text not null default '',
  items text[] not null default '{}',
  who_for text not null default '',
  included text not null default '',
  format text not null default '',
  timeline text not null default '',
  cta_label text,
  primary key (service_id, locale),
  constraint service_translations_locale_chk check (locale in ('en', 'bg'))
);

create index if not exists services_sort_idx on public.services (sort_order, id);
create index if not exists service_translations_locale_idx on public.service_translations (locale);

alter table public.services enable row level security;
alter table public.service_translations enable row level security;

drop policy if exists "services select active or admin" on public.services;
create policy "services select active or admin"
  on public.services for select
  using (is_active = true or public.is_admin());

drop policy if exists "services insert admin" on public.services;
create policy "services insert admin"
  on public.services for insert
  with check (public.is_admin());

drop policy if exists "services update admin" on public.services;
create policy "services update admin"
  on public.services for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "services delete admin" on public.services;
create policy "services delete admin"
  on public.services for delete
  using (public.is_admin());

drop policy if exists "service_translations select active or admin" on public.service_translations;
create policy "service_translations select active or admin"
  on public.service_translations for select
  using (
    exists (
      select 1 from public.services s
      where s.id = service_translations.service_id
        and (s.is_active = true or public.is_admin())
    )
  );

drop policy if exists "service_translations insert admin" on public.service_translations;
create policy "service_translations insert admin"
  on public.service_translations for insert
  with check (public.is_admin());

drop policy if exists "service_translations update admin" on public.service_translations;
create policy "service_translations update admin"
  on public.service_translations for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "service_translations delete admin" on public.service_translations;
create policy "service_translations delete admin"
  on public.service_translations for delete
  using (public.is_admin());

grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant select on public.service_translations to anon, authenticated;
grant insert, update, delete on public.service_translations to authenticated;
