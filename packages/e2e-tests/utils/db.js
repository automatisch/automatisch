const { Client } = require('pg');

async function getClient() {
  const client = new Client({
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'password',
    database: process.env.PGDATABASE || 'postgres',
    port: Number(process.env.PGPORT) || 5432,
    statement_timeout: 5000,
  });
  await client.connect();
  return client;
}

async function initTemplate(client, user, database, templateDatabase) {
  const DUPLICATE_DB_CODE = '42P04';
  try {
    await client.query(`
      ALTER DATABASE ${database} WITH ALLOW_CONNECTIONS false;
      SELECT pg_terminate_backend(pid) FROM pg_stat_activity
        WHERE datname='${database}';`);
    await client.query(`
      CREATE DATABASE ${templateDatabase} WITH
        OWNER=${user}
        TEMPLATE=${database}
        IS_TEMPLATE=true;`);
  } catch (err) {
    console.error(err.code);
    if (err.code !== DUPLICATE_DB_CODE) {
      throw err;
    }
  }
}

async function initTestDatabase(client, user, database, template) {
  const oldDatabase = `${database}_old`;
  await client.query(`
    SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname='${database}';
    ALTER DATABASE ${database}
      RENAME TO ${oldDatabase};`);
  await client.query(`
    CREATE DATABASE ${database}
      WITH OWNER ${user}
      TEMPLATE=${template};`);
  await client.query(`DROP DATABASE ${oldDatabase}`);
}

async function resetTestDatabase() {
  const client = await getClient();
  const user = process.env.POSTGRES_USERNAME;
  const database = process.env.POSTGRES_DATABASE;
  const templateDatabase =
    process.env.POSTGRES_DATABASE_TEMPLATE || `${database}_template`;
  await initTemplate(client, user, database, templateDatabase);
  await initTestDatabase(client, user, database, templateDatabase);
  await client.end();
}

module.exports = { resetTestDatabase };
