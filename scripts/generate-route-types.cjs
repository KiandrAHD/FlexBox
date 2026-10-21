// Regenerate from a fresh app-only context, not the dev server's file watcher.
// SDK 58 on Windows can retain ../ entries and index suffixes during file moves.
const fs = require('node:fs');
const path = require('node:path');
// eslint-disable-next-line no-undef -- CommonJS script executed by Node.
const root = path.resolve(__dirname, '..');
const { requireContext } = require('expo-router/internal/testing');
const { EXPO_ROUTER_CTX_IGNORE } = require('expo-router/_ctx-shared');
const cli = require.resolve('@expo/cli/package.json', {
  paths: [path.dirname(require.resolve('expo/package.json'))],
});
const generator = require(require.resolve('@expo/router-server/build/typed-routes/generate', {
  paths: [path.dirname(cli)],
}));
const context = requireContext(path.join(root, 'app'), true, EXPO_ROUTER_CTX_IGNORE);
const declaration = generator.getTypedRoutesDeclarationFile(context);
if (!declaration) throw new Error('Expo Router did not generate route declarations.');
const directory = path.join(root, '.expo', 'types');
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(path.join(directory, 'router.d.ts'), declaration);
