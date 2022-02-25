import { Command } from '@oclif/core';

export default class Start extends Command {
  static description = 'Say hello world';

  async run(): Promise<void> {
    this.log('hello world from start script');
  }
}
