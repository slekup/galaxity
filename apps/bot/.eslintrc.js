const path = require('path');

module.exports = {
  root: true,
  extends: ['galaxity'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.next/'],
  rules: {
    'jsdoc/require-jsdoc': 0,
    'no-console': 0,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [path.resolve(__dirname, 'tsconfig.json')],
      },
      node: true,
    },
  },
};
