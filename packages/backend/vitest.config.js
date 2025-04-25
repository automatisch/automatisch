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
      include: [
        '**/src/controllers/**',
        '**/src/helpers/authentication.test.js',
        '**/src/helpers/axios-with-proxy.test.js',
        '**/src/helpers/compute-parameters.test.js',
        '**/src/helpers/user-ability.test.js',
        '**/src/models/**',
        '**/src/serializers/**',
      ],
      exclude: [
        '**/src/controllers/webhooks/**',
        '**/src/controllers/paddle/**',
      ],
      thresholds: {
        autoUpdate: true,
        statements: 99.42,
        branches: 98.37,
        functions: 99.08,
        lines: 99.42,
      },
    },
  },
});