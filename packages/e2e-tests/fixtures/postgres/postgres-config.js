const { Pool } = require('pg');

const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USERNAME,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE
});

exports.pgPool = pool;
