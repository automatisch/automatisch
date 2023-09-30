require('dotenv').config({ path: '../backend/.env' });

const axios = require('axios');
const nock = require('nock');

const scope = nock('https://license.automatisch.io', {
  allowUnmocked: true,
})
  .post('/api/v1/licenses/verify')
  .reply(200, {
    id: '7f22d7dd-1fda-4482-83fa-f35bf974a21f',
    name: 'Mocked license',
    expireAt: '2030-08-09T10:56:54.144Z',
  })
  .persist();

// runs the backend process
require('@automatisch/backend/server');