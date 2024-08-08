const fileExtension = 'js';

const knexConfig = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USERNAME,
    port: process.env.POSTGRES_PORT,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE
  },
  searchPath: ['public'],
  pool: { min: 0, max: 20 },
  migrations: {
    directory: '../../packages/backend/src/db/migrations/',
    extension: fileExtension,
    loadExtensions: [`.${fileExtension}`],
  },
  seeds: {
    directory: '../../packages/backend/src/db/seeds/',
  },
  ...(process.env.APP_ENV === 'test' ? knexSnakeCaseMappers() : {}),
};

export default knexConfig;
