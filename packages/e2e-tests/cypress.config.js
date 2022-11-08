const { defineConfig } = require('cypress');

const TO_BE_PROVIDED = 'HAS_TO_BE_PROVIDED_IN_cypress.env.json';

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    env: {
      login_email: 'user@automatisch.io',
      login_password: 'sample',
      deepl_auth_key: TO_BE_PROVIDED,
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 768,
  },
});
