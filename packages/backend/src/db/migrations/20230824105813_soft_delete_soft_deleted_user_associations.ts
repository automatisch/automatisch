import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const users = await knex('users').whereNotNull('deleted_at');
  const userIds = users.map((user) => user.id);

  const flows = await knex('flows').whereIn('user_id', userIds);
  const flowIds = flows.map((flow) => flow.id);
  const executions = await knex('executions').whereIn('flow_id', flowIds);
  const executionIds = executions.map((execution) => execution.id);

  await knex('execution_steps').whereIn('execution_id', executionIds).update({
    deleted_at: knex.fn.now(),
  });

  await knex('executions').whereIn('id', executionIds).update({
    deleted_at: knex.fn.now(),
  });

  await knex('steps').whereIn('flow_id', flowIds).update({
    deleted_at: knex.fn.now(),
  });

  await knex('flows').whereIn('id', flowIds).update({
    deleted_at: knex.fn.now(),
  });

  await knex('connections').whereIn('user_id', userIds).update({
    deleted_at: knex.fn.now(),
  });
}

export async function down(): Promise<void> {
  // void
}
