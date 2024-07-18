const { Client } = require('pg');

const client = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USERNAME,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE
});

exports.client = client;
