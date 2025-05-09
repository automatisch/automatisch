import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig(() => {
  return {
    // https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
    define: {
      'process.env': {},
    },
    build: {
      outDir: 'build',
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      process.env.APP_ENV !== 'test' && {
        ...eslint({
          include: ['src/**/*.js', 'src/**/*.jsx'],
        }),
        apply: 'build',
      },
      {
        ...eslint({
          include: ['src/**/*.js', 'src/**/*.jsx'],
          failOnWarning: false,
          failOnError: false,
        }),
        apply: 'serve',
        enforce: 'post',
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        components: path.resolve(__dirname, './src/components'),
        config: path.resolve(__dirname, './src/config'),
        contexts: path.resolve(__dirname, './src/contexts'),
        helpers: path.resolve(__dirname, './src/helpers'),
        hooks: path.resolve(__dirname, './src/hooks'),
        locales: path.resolve(__dirname, './src/locales'),
        pages: path.resolve(__dirname, './src/pages'),
        propTypes: path.resolve(__dirname, './src/propTypes'),
        styles: path.resolve(__dirname, './src/styles'),
      },
    },
    server: {
      open: true,
      port: process.env.PORT || 3001,
    },
  };
});
