# Admin authorization repair — QA

## Findings

The previous provider conflated a missing profile with a non-admin role. Auth account creation alone does not provision `profiles` in the checked-in schema. The exact affected remote account was not inspected: no deliberately selected UID or authorized account session was supplied. A profile hidden by RLS also appears absent to the client. Follow the UID-specific SQL diagnostics in SUPABASE_SETUP.md before assigning a root cause to that account.

No remote data, roles, policies, or migrations were changed. Repository SQL review did not establish a policy defect requiring a corrective migration.

## Executed

- `npm run typecheck`: passed after final source changes.
- `npm run lint`: passed; rerun after final font/service edits recorded separately in execution output.
- `npm test -- --runInBand`: 8 passed, mocked identity/profile verification.
- `npx expo install --check`: passed.
- `npx expo-doctor`: 20/20 passed.
- `npm run export:web`: passed after final source changes.
- `git diff --check`: passed (line-ending warnings only).
- Chromium at 1440px and 390px: anonymous protected URL redirected to login; login refresh rendered. All seven dashboard routes rendered with an intercepted admin/session/data fixture. No uncaught page errors or document horizontal overflow. Logout then browser back kept protected UI closed in both viewports.

Browser fixtures are only in the external temporary QA harness. Production application authentication is not mocked. Fixture metrics are zero; screenshots are not evidence of remote database counts. Screenshots: `C:\Users\MyBook Hype AMD\AppData\Local\Temp\opencode\flexbox-browser\login-{1440,390}.png` and `dashboard-{1440,390}.png`.

An earlier browser run overlapped export regeneration and lost its temporary static server; the complete run after export succeeded. Initial screenshot review found font family names did not match loaded Expo font aliases; admin fonts were corrected and screenshots regenerated.

## Not established

Real admin/member/no-profile login, wrong-password response, live profile permission failures, token expiration, live CRUD and RLS across roles, populated-record responsive forms, Android runtime, and production readiness. Unit tests do not replace those checks. No commit or push was performed. Pre-existing deleted `.gitkeep` files and `supabase/.temp/` were left untouched.
