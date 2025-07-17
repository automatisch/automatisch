import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@/models': resolve(__dirname, './src/models'),
      '@/controllers': resolve(__dirname, './src/controllers'),
      '@/helpers': resolve(__dirname, './src/helpers'),
      '@/config': resolve(__dirname, './src/config'),
      '@/errors': resolve(__dirname, './src/errors'),
      '@/queues': resolve(__dirname, './src/queues'),
      '@/workers': resolve(__dirname, './src/workers'),
      '@/jobs': resolve(__dirname, './src/jobs'),
      '@/services': resolve(__dirname, './src/services'),
      '@/routes': resolve(__dirname, './src/routes'),
      '@/serializers': resolve(__dirname, './src/serializers'),
      '@/factories': resolve(__dirname, './test/factories'),
      '@/mocks': resolve(__dirname, './test/mocks'),
    },
  },
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
        statements: 99.44,
        branches: 98.5,
        functions: 99.12,
        lines: 99.44,
      },
    },
  },
});
