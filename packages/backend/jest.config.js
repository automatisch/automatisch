/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setup/global-hooks.ts'],
  globalTeardown: './test/setup/global-teardown.ts',
};
