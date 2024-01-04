async function addDeletedColumn(knex, tableName) {
  return await knex.schema.table(tableName, (table) => {
    table.timestamp('deleted_at').nullable();
  });
}

async function dropDeletedColumn(knex, tableName) {
  return await knex.schema.table(tableName, (table) => {
    table.dropColumn('deleted_at');
  });
}

export async function up(knex) {
  await addDeletedColumn(knex, 'steps');
  await addDeletedColumn(knex, 'flows');
  await addDeletedColumn(knex, 'executions');
  await addDeletedColumn(knex, 'execution_steps');
  await addDeletedColumn(knex, 'users');
  await addDeletedColumn(knex, 'connections');
}

export async function down(knex) {
  await dropDeletedColumn(knex, 'steps');
  await dropDeletedColumn(knex, 'flows');
  await dropDeletedColumn(knex, 'executions');
  await dropDeletedColumn(knex, 'execution_steps');
  await dropDeletedColumn(knex, 'users');
  await dropDeletedColumn(knex, 'connections');
}
