# Content Schema (Admin Inline Editing)

This document defines the canonical storage model and stable key convention for editable copy.

## Canonical key shape

- `page`: logical page or shared surface (`home`, `mission`, `who_benefits`, `applications`, `shared`)
- `section`: scoped content group (`hero_slider`, `intro`, `navigation`, etc.)
- `key`: stable field identifier within section (`headline`, `body_1`, `cta_label`, etc.)
- `locale`: language code (`en` for current rollout)

Composite identity: `(page, section, key, locale)`.

## SQL table definition

```sql
CREATE TABLE content_blocks (
  id BIGSERIAL PRIMARY KEY,
  page VARCHAR(64) NOT NULL,
  section VARCHAR(64) NOT NULL,
  key VARCHAR(64) NOT NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  value TEXT NOT NULL,
  value_type VARCHAR(16) NOT NULL DEFAULT 'plain_text',
  updated_by VARCHAR(128),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT content_blocks_identity_unique UNIQUE (page, section, key, locale),
  CONSTRAINT content_blocks_version_positive CHECK (version > 0)
);

CREATE INDEX idx_content_blocks_page_locale ON content_blocks (page, locale);
CREATE INDEX idx_content_blocks_updated_at ON content_blocks (updated_at DESC);
```

## Update semantics

- The app updates `public.site_content` via the Supabase browser client (`upsert` on composite key), guarded by RLS + `is_admin()`.
- On update:
  - overwrite `value` and optional `value_type`
  - increment `version` by 1
  - set `updated_at = NOW()`
  - set `updated_by` from authenticated admin identity

## Stable keys for phase 1 scope

These keys map to current hardcoded copy and should remain stable even if UI layout changes.

### `home` page

- `hero_slider/slide_1_label`
- `hero_slider/slide_1_headline`
- `hero_slider/slide_1_description`
- `hero_slider/slide_1_cta_label`
- `hero_slider/slide_2_label`
- `hero_slider/slide_2_headline`
- `hero_slider/slide_2_description`
- `hero_slider/slide_2_cta_label`
- `hero_slider/slide_3_label`
- `hero_slider/slide_3_headline`
- `hero_slider/slide_3_description`
- `hero_slider/slide_3_cta_label`

### `mission` page

- `hero/eyebrow`
- `hero/title_prefix`
- `hero/title_highlight`
- `hero/body_1`
- `hero/body_2`
- `overview/highlight_quote`
- `overview/body_1`
- `overview/body_2`
- `overview/body_3`
- `disclaimers/line_1`
- `disclaimers/line_2`
- `disclaimers/line_3`
- `evidence/body_1`
- `evidence/highlight_quote`
- `cta/button_label`

### `who_benefits` page

- `hero/eyebrow`
- `hero/title_prefix`
- `hero/title_highlight`
- `hero/body_1`
- `individuals/title`
- `individuals/item_1`
- `individuals/item_2`
- `individuals/item_3`
- `individuals/item_4`
- `individuals/item_5`
- `individuals/item_6`
- `individuals/item_7`
- `organisations/title`
- `organisations/body_1`
- `organisations/item_1`
- `organisations/item_2`
- `organisations/item_3`
- `cta/button_label`

### `applications` page

- `hero/eyebrow`
- `hero/title_prefix`
- `hero/title_highlight`
- `hero/body_1`
- `applications_grid/item_1_title`
- `applications_grid/item_1_desc`
- `applications_grid/item_2_title`
- `applications_grid/item_2_desc`
- `applications_grid/item_3_title`
- `applications_grid/item_3_desc`
- `applications_grid/item_4_title`
- `applications_grid/item_4_desc`
- `applications_grid/item_5_title`
- `applications_grid/item_5_desc`
- `applications_grid/item_6_title`
- `applications_grid/item_6_desc`
- `applications_grid/item_7_title`
- `applications_grid/item_7_desc`
- `applications_grid/item_8_title`
- `applications_grid/item_8_desc`
- `closing/highlight_quote`
- `closing/line_1`
- `closing/line_2`
- `closing/line_3`
- `cta/button_label`

### `shared` surfaces

- `header/navigation_home`
- `header/navigation_about`
- `header/navigation_applications`
- `header/navigation_who_benefits`
- `header/navigation_advisory`
- `header/navigation_apply_book`
- `footer/tagline`
- `footer/navigation_title`
- `footer/navigation_about`
- `footer/navigation_applications`
- `footer/navigation_who_benefits`
- `footer/navigation_advisory`
- `footer/navigation_apply_book`
- `footer/contact_title`
- `footer/contact_email`
- `footer/contact_linkedin_label`
- `footer/legal_copyright`
- `footer/legal_privacy_policy`
- `footer/legal_terms_of_service`
