import pg from 'pg';

const client = new pg.Client({
  host: process.env.POSTGRES_HOST || 'localhost',
  user: process.env.POSTGRES_USERNAME || 'postgres',
  port: Number.parseInt(process.env.POSTGRES_PORT) || 5432,
  password: process.env.POSTGRES_PASSWORD
});

export default client;
