import pg from 'pg';

const client = new pg.Client({
  host: 'localhost',
  user: 'postgres',
  port: 5433,
  password: 'abcd'
});

export default client;
