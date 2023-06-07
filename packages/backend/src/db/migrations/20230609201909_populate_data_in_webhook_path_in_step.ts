import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return await knex('steps')
    .where('type', 'trigger')
    .whereIn('app_key', ['gitlab', 'typeform', 'twilio', 'flowers-software', 'webhook'])
    .update({
      webhook_path: knex.raw('? || ??', ['/webhooks/flows/', knex.ref('flow_id')]),
    });
}

export async function down(knex: Knex): Promise<void> {
  return await knex('steps').update({
    webhook_path: null
  });
}
