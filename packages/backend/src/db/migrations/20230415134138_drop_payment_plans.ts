import { Knex } from 'knex';
import appConfig from '../../config/app';

export async function up(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.dropTable('payment_plans');
}

export async function down(knex: Knex): Promise<void> {
  if (!appConfig.isCloud) return;

  return knex.schema.createTable('payment_plans', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.integer('task_count').notNullable();
    table.uuid('user_id').references('id').inTable('users');
    table.string('stripe_customer_id');
    table.string('stripe_subscription_id');
    table.timestamp('current_period_started_at').nullable();
    table.timestamp('current_period_ends_at').nullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
  });
}
