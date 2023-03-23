import { Knex } from 'knex';
import appConfig from '../../config/app';

export async function up(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.createTable('subscriptions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users');
    table.string('paddle_subscription_id').unique().notNullable();
    table.string('paddle_plan_id').notNullable();
    table.string('update_url').notNullable();
    table.string('cancel_url').notNullable();
    table.string('status').notNullable();
    table.string('next_bill_amount').notNullable();
    table.date('next_bill_date').notNullable();
    table.date('last_bill_date');

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.dropTable('subscriptions');
}
