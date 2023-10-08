const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');
const { run, send } = require('micro');

const options = {
  key: fs.readFileSync(path.join(__dirname, './automatisch.io+4-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './automatisch.io+4.pem')),
};

const microHttps = (fn) =>
  https.createServer(options, (req, res) => run(req, res, fn));

const server = microHttps(async (req, res) => {
  const data = {
    id: '7f22d7dd-1fda-4482-83fa-f35bf974a21f',
    name: 'Mocked license',
    expireAt: '2030-08-09T10:56:54.144Z',
  };

  send(res, 200, data);
});

server
  .once('listening', () => {
    console.log('The mock server is up.');
  })
  .listen(443);
