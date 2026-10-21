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
- Auth uses Supabase web session persistence. Native session storage adapters are intentionally not added; configure secure platform storage before a native release.
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

Migration SQL has not been executed against any local or remote database by this implementation.
