# Content CMS setup

## Runtime contract

- `types/content.ts` preserves public display models and re-exports structured contracts from `types/cms.ts`, which defines plain-text content, discriminated page sections, database rows, and repository interfaces.
- `features/content/repository.ts` is the only public query boundary. Feature services in `features/pages`, `projects`, `team`, and `technologies` delegate to it.
- Without both environment variables, public reads use clearly labeled concept data. There are no fabricated team identities. Contact submission and admin login fail explicitly, never report mock success.
- With configuration, reads use Supabase. Query failures surface as errors; empty results remain empty. Drafts and hidden members are explicitly filtered even in admin sessions.
- Mock IDs are demo identifiers, not database UUIDs. Do not submit them as CMS relations.
- Existing routes are not wired by this change. Consumers should call services, handle loading/error/empty/not-found states, and display the repository `source` when presenting demo content.

## Provisioning (manual; no remote changes performed)

1. Create a Supabase project. Disable public signups in Auth settings. Configure the actual site URL and allowed redirect URLs.
2. Review `supabase/migrations/20261021000100_content_cms.sql`. Apply to a disposable local Supabase instance first using the Supabase CLI, then explicitly deploy to the intended project using your normal migration process. Do not rerun the initial migration against an existing schema without review.
3. Create the initial user through trusted Supabase Auth administration. In the SQL editor, provision `profiles` for that known user's UUID with `role = 'admin'`. Never derive roles from editable user metadata. Other users should receive `member` only; there is no client profile insert/update grant or automatic admin bootstrap.
4. Copy `.env.example` to `.env`. Set the project URL and public anon key, then restart Expo. Never use a service-role key in `EXPO_PUBLIC_*` variables.
5. Populate pages and sections, projects, technologies, and members through trusted tooling. All editorial records default to draft/hidden. Publish only reviewed content. Page slugs are `home`, `about`, `team`, `projects`, `contact`; section keys must be URL-safe and unique within a page.
6. Generate Supabase database TypeScript types after schema changes, e.g. `supabase gen types typescript --local > types/database.ts`, then replace the repository's explicit row assertions with those generated client types. Keep `types/content.ts` aligned with enums and fields.

## Security and data behavior

- RLS is enabled on all eight tables. Public reads require published pages/projects, published sections under published parents, visible members/technologies, and visible project-technology relationships. Admin policies check `profiles` through a fixed-search-path security-definer function. Member sessions have no editorial writes.
- Profiles have read-only access for self/admin. Role provisioning remains trusted SQL only. No user can promote themselves through the API.
- Public contact inserts are column-restricted to `name`, `email`, `subject`, `message`. They return no rows and cannot set IDs, timestamps, or statuses. Only admins can read/update/delete messages. Database constraints enforce lengths and email format.
- Client honeypot, in-flight lock, and 30-second cooldown are basic UX defenses, not a security rate limit. Before exposing a high-traffic form, add a server-side rate-limited/CAPTCHA-verified Edge Function and revoke direct public INSERT if routing through that function. Define message retention/deletion procedures.
- Content is plain text. Never render it as raw HTML. Section JSON checks validate the top-level kind, not the full discriminated union; trusted CMS editors must validate the remaining shape before saving. If untrusted editorial roles are introduced, add full server-side section-schema validation first.
- URLs accept HTTPS only in SQL. Restrict destinations further if needed. Storage paths are object paths, not HTML. No buckets or Storage policies are installed by this migration. Before uploads, configure a public-assets bucket with admin-only writes, MIME/size limits, and safe generated names. Do not expose draft-private assets through public buckets.
- Auth persists sessions through AsyncStorage on web/native. Identity is revalidated with `getUser()` before reading the same UID's profile. AsyncStorage is not encrypted secure storage; review native secure storage before release.
- New technology relations use `ON DELETE RESTRICT` for technologies, preventing accidental deletion of in-use entries. Deleting a project removes its join rows.

## Verification checklist

Run `npm run typecheck` and `npm run lint`. With a disposable database, verify separately as anon, member, and admin:

- Draft/archived project detail returns no rows; a draft page's sections remain private.
- Hidden team and technology rows/relations remain private.
- Anon/member cannot mutate editorial records or update profile roles.
- Valid contact insertion succeeds without `.select()`; reading it or specifying a status/ID fails.
- Only admin can read messages and update statuses.
- Duplicate normalized technology names/slugs and invalid URLs/field lengths fail.
- Missing environment uses demo reads; configured network errors do not fall back; disconnected submissions do not claim success.

No remote migration or account provisioning was performed during this authorization repair. API connectivity alone does not prove deployed policies or an individual account's role.

## Diagnose one deliberately selected Auth UID

Copy **User UID** from the intended user in Authentication → Users. Do not query by password/email or dump all profiles. Run manually in the trusted SQL Editor, replacing the placeholder:

```sql
select id, role, created_at
from public.profiles
where id = 'GANTI_DENGAN_AUTH_USER_UID';
```

- Zero rows: the Auth account has no matching profile. Auth account creation does not create a profile in this schema.
- `member`: login can succeed but workspace access is correctly denied.
- `admin`: compare the UID with the selected Auth account and ensure Expo uses the same Supabase project. If the client cannot read this row, inspect grants/policies below.
- A client `maybeSingle()` returning no row can also mean RLS filtered it; the UI cannot conclusively distinguish that from absence. SQL Editor inspection resolves the ambiguity.

### Controlled provisioning (manual, privileged)

Only after confirming ownership and intended administrator access for that exact Auth UID:

```sql
begin;
insert into public.profiles (id, role)
values ('GANTI_DENGAN_AUTH_USER_UID', 'admin')
on conflict (id) do update set role = excluded.role;
commit;
```

The foreign key requires an existing Auth user. This intentionally changes access for that UID only. Never run it for all users, grant client writes to `profiles`, or derive roles from user metadata. After provisioning, choose **Periksa akses kembali**; no password change is necessary.

### Schema and permission inspection (read-only)

```sql
select name, to_regclass('public.' || name) as relation
from unnest(array['profiles','pages','page_sections','projects',
  'project_technologies','team_members','technologies','contact_messages']) as name;

select tablename, rowsecurity
from pg_tables where schemaname = 'public'
  and tablename in ('profiles','pages','page_sections','projects',
    'project_technologies','team_members','technologies','contact_messages');

select tablename, policyname, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public'
  and tablename in ('profiles','pages','page_sections','projects',
    'project_technologies','team_members','technologies','contact_messages');

select has_table_privilege('authenticated', 'public.profiles', 'select') as can_read,
       has_table_privilege('authenticated', 'public.profiles', 'update') as can_update;
select pg_get_functiondef('public.is_admin()'::regprocedure);
```

Expected: all eight relations exist, RLS enabled, authenticated profile SELECT granted but UPDATE not granted. `profile_read` permits own UID; `is_admin()` uses a fixed empty search path and trusted owner. Editorial writes require `is_admin()`. Public reads enforce published/visible; contact SELECT/UPDATE/DELETE are admin-only. Do not disable RLS to resolve errors. Compare deployed definitions with the migration before preparing any corrective migration; no policy defect was established in the checked-in SQL.

### Runtime verification matrix

Use a disposable project and intentionally provisioned admin/member/no-profile accounts. Do not share passwords or tokens in logs/chat.

1. Admin: password sign-in, `getUser()`, matching profile, redirect to `/dashboard`; refresh each protected route.
2. Member: password sign-in succeeds, workspace denied; direct editorial mutations fail.
3. No profile: distinct profile-unavailable notice; no dashboard render.
4. Wrong password: authentication error, not a profile/RLS error.
5. Profile permission/network failure: verification error and retry, never a false password error.
6. Expired session: reject invalid identity; anonymous protected routes redirect to login.
7. Logout and browser back: protected content stays closed; refresh cannot restore a removed session.
8. As anon/member/admin separately, test drafts/hidden rows, all editorial writes, profile role mutation denial, and message access. Use disposable records and clean up intentionally.

`features/auth/verifyAdmin.test.ts` covers mocked identity/profile outcomes only. It does not establish live RLS, actual credentials, persistence, or CRUD correctness. Native secure storage and server-side contact abuse protection remain release requirements.
