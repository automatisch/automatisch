module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['**/*.test.ts', '**/test/**/*.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': ['off'],
      },
    },
  ],
};
