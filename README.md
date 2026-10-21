# FlexBox

Phase 0 foundation for Expo Web.

## Development

```bash
npm install
npm run web
```

Checks: `npm run typecheck`, `npm run lint`, `npm test`, and `npm run export:web`.

`npm run typecheck` regenerates Expo Router declarations from the current `app/` tree before running TypeScript. This avoids stale Windows dev-server watcher entries after route moves. The generator uses the installed SDK 58 CLI internals; review it when upgrading Expo. `.expo/types` remains generated and is not committed.

Supabase variables are documented in `.env.example`. No database schema or client connection is configured in Phase 0.
