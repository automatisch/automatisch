import { readFileSync } from 'fs';
import { Command, Flags } from '@oclif/core';
import * as dotenv from 'dotenv';

export default class StartWorker extends Command {
  static description = 'Run automatisch worker';

  static flags = {
    env: Flags.string({
      multiple: true,
      char: 'e',
    }),
    'env-file': Flags.string(),
  };

  async prepareEnvVars(): Promise<void> {
    const { flags } = await this.parse(StartWorker);

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

  async runWorker(): Promise<void> {
    await import('@automatisch/backend/worker');
  }

  async run(): Promise<void> {
    await this.prepareEnvVars();

    await this.runWorker();
  }
}
