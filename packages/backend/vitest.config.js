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
      '@/middlewares': resolve(__dirname, './src/middlewares'),
      '@/config': resolve(__dirname, './src/config'),
      '@/errors': resolve(__dirname, './src/errors'),
      '@/queues': resolve(__dirname, './src/queues'),
      '@/workers': resolve(__dirname, './src/workers'),
      '@/jobs': resolve(__dirname, './src/jobs'),
      '@/engine': resolve(__dirname, './src/engine'),
      '@/routes': resolve(__dirname, './src/routes'),
      '@/serializers': resolve(__dirname, './src/serializers'),
      '@/factories': resolve(__dirname, './test/factories'),
      '@/mocks': resolve(__dirname, './test/mocks'),
      '@/test/workers': resolve(__dirname, './test/workers'),
    },
  },
  test: {
    projects: [
      {
        // add "extends: true" to inherit the options from the root config
        extends: true,
        test: {
          testTimeout: 10000,
          exclude: ['**/src/engine/tests/**', '**/node_modules/**'],
          name: 'automatisch',
          setupFiles: ['./test/setup/global-hooks.js'],
        },
      },
      {
        // add "extends: true" to inherit the options from the root config
        extends: true,
        test: {
          testTimeout: 10000,
          include: ['**/src/engine/tests/**/*.test.js'],
          exclude: ['**/node_modules/**'],
          name: 'automatisch engine',
          pool: 'threads',
          fileParallelism: false,
          poolOptions: {
            threads: {
              singleThread: true,
            },
          },
          setupFiles: ['./test/setup/global-engine-hooks.js'],
        },
      },
    ],
    root: './',
    environment: 'node',
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
        '**/src/helpers/authentication.js',
        '**/src/helpers/axios-with-proxy.js',
        '**/src/helpers/compute-parameters.js',
        '**/src/helpers/user-ability.js',
        '**/src/engine/**',
        '**/src/models/**',
        '**/src/serializers/**',
      ],
      exclude: [
        '**/*.test.js',
        '**/src/controllers/paddle/**',
        '**/src/controllers/webhooks/**',
      ],
      thresholds: {
        autoUpdate: true,
        statements: 94.74,
        branches: 97.89,
        functions: 98.23,
        lines: 94.74,
      },
    },
  },
});
