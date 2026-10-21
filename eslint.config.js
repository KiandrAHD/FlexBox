const expo = require('eslint-config-expo/flat');

module.exports = [
  ...expo,
  {
    ignores: ['dist/**', 'web-build/**', '.expo/**', 'node_modules/**'],
  },
];
