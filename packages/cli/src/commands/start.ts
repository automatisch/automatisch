import { Command, Flags } from '@oclif/core';
import * as dotenv from 'dotenv';

export default class Start extends Command {
  static description = 'Run automatisch';

  static flags = {
    env: Flags.string({
      multiple: true,
      char: 'e',
    }),
    'env-file': Flags.string()
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Start);

    if (flags['env-file']) {
      dotenv.config({ path: flags['env-file'] });
    }

    if (flags.env) {
      for (const env of flags.env) {
        const [key, value] = env.split('=');
        process.env[key] = value;
      }
    }

    const database = (await import('@automatisch/backend/src/config/database')).default;
    const migrator = database.migrate;

    const [, pendingMigrations] = await migrator.list();
    const pendingMigrationsCount = pendingMigrations.length;
    const needsToMigrate = pendingMigrationsCount > 0;

    if (needsToMigrate) {
      await migrator.latest();
    }
  }
}
