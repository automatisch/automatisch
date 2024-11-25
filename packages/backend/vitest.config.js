import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: './',
    environment: 'node',
    setupFiles: ['./test/setup/global-hooks.js'],
    globals: true,
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
    coverage: {
      reportOnFailure: true,
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov'],
      all: true,
      include: ['**/src/models/**', '**/src/controllers/**'],
      thresholds: {
        autoUpdate: true,
        statements: 93.41,
        branches: 93.46,
        functions: 95.95,
        lines: 93.41,
      },
    },
  },
});
