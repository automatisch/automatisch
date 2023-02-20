import { readFileSync } from 'fs';
import { Command, Flags } from '@oclif/core';
import * as dotenv from 'dotenv';

export default class Start extends Command {
  static description = 'Run automatisch';

  static flags = {
    env: Flags.string({
      multiple: true,
      char: 'e',
    }),
    'env-file': Flags.string(),
  };

  get isProduction() {
    return process.env.APP_ENV === 'production';
  }

  async prepareEnvVars(): Promise<void> {
    const { flags } = await this.parse(Start);

    if (flags['env-file']) {
      const envFile = readFileSync(flags['env-file'], 'utf8');
      const envConfig = dotenv.parse(envFile);

      for (const key in envConfig) {
        const value = envConfig[key];
        process.env[key] = value;
      }
    }

    if (flags.env) {
      for (const env of flags.env) {
        const [key, value] = env.split('=');
        process.env[key] = value;
      }
    }
  }

  async createDatabaseAndUser(): Promise<void> {
    const utils = await import('@automatisch/backend/database-utils');

    await utils.createDatabaseAndUser(
      process.env.POSTGRES_DATABASE,
      process.env.POSTGRES_USERNAME
    );
  }

  async runMigrationsIfNeeded(): Promise<void> {
    const { logger } = await import('@automatisch/backend/logger');
    const database = await import('@automatisch/backend/database');
    const migrator = database.client.migrate;

    const [, pendingMigrations] = await migrator.list();
    const pendingMigrationsCount = pendingMigrations.length;
    const needsToMigrate = pendingMigrationsCount > 0;

    if (needsToMigrate) {
      logger.info(`Processing ${pendingMigrationsCount} migrations.`);

      await migrator.latest();
      logger.info(`Completed ${pendingMigrationsCount} migrations.`);
    } else {
      logger.info('No migrations needed.');
    }
  }

  async seedUser(): Promise<void> {
    const utils = await import('@automatisch/backend/database-utils');

    await utils.createUser();
  }

  async runApp(): Promise<void> {
    await import('@automatisch/backend/server');
  }

  async run(): Promise<void> {
    await this.prepareEnvVars();

    if (!this.isProduction) {
      await this.createDatabaseAndUser();
    }

    await this.runMigrationsIfNeeded();

    await this.seedUser();

    await this.runApp();
  }
}
