export async function up(knex) {
  return knex.schema.alterTable('steps', (table) => {
    table.string('key').nullable().alter();
    table.string('app_key').nullable().alter();
  });
}

export async function down() {
  // We can't use down migration here since there are null values which needs to be set!
  // We don't want to set those values by default key and app key since it will mislead users.
  // return knex.schema.alterTable('steps', (table) => {
  //   table.string('key').notNullable().alter();
  //   table.string('app_key').notNullable().alter();
  // });
}
