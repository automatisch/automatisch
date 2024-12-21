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
      exclude: [
        '**/src/controllers/webhooks/**',
        '**/src/controllers/paddle/**',
      ],
      thresholds: {
        autoUpdate: true,
        statements: 99.44,
        branches: 97.78,
        functions: 99.1,
        lines: 99.44,
      },
    },
  },
});
