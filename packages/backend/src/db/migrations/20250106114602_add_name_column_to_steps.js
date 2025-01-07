import toLower from 'lodash/toLower.js';
import startCase from 'lodash/startCase.js';
import upperFirst from 'lodash/upperFirst.js';

export async function up(knex) {
  await knex.schema.table('steps', function (table) {
    table.string('name');
  });

  const rows = await knex('steps').select('id', 'key');

  const updates = rows.map((row) => {
    if (!row.key) return;

    const humanizedKey = upperFirst(toLower(startCase(row.key)));
    return knex('steps').where({ id: row.id }).update({ name: humanizedKey });
  });

  return await Promise.all(updates);
}

export async function down(knex) {
  return knex.schema.table('steps', function (table) {
    table.dropColumn('name');
  });
}
