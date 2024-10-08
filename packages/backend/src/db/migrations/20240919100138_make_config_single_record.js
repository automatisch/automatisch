export async function up(knex) {
  await knex.schema.alterTable('config', (table) => {
    table.dropUnique('key');

    table.string('key').nullable().alter();
    table.boolean('installation_completed').defaultTo(false);
    table.text('logo_svg_data');
    table.text('palette_primary_dark');
    table.text('palette_primary_light');
    table.text('palette_primary_main');
    table.string('title');
  });

  const config = await knex('config').select('key', 'value');

  const newConfigData = {
    logo_svg_data: getValueForKey(config, 'logo.svgData'),
    palette_primary_dark: getValueForKey(config, 'palette.primary.dark'),
    palette_primary_light: getValueForKey(config, 'palette.primary.light'),
    palette_primary_main: getValueForKey(config, 'palette.primary.main'),
    title: getValueForKey(config, 'title'),
    installation_completed: getValueForKey(config, 'installation.completed'),
  };

  const [configEntry] = await knex('config')
    .insert(newConfigData)
    .select('id')
    .returning('id');

  await knex('config').where('id', '!=', configEntry.id).delete();

  await knex.schema.alterTable('config', (table) => {
    table.dropColumn('key');
    table.dropColumn('value');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('config', (table) => {
    table.string('key');
    table.jsonb('value').notNullable().defaultTo({});
  });

  const configRow = await knex('config').first();

  const config = [
    {
      key: 'logo.svgData',
      value: {
        data: configRow.logo_svg_data,
      },
    },
    {
      key: 'palette.primary.dark',
      value: {
        data: configRow.palette_primary_dark,
      },
    },
    {
      key: 'palette.primary.light',
      value: {
        data: configRow.palette_primary_light,
      },
    },
    {
      key: 'palette.primary.main',
      value: {
        data: configRow.palette_primary_main,
      },
    },
    {
      key: 'title',
      value: {
        data: configRow.title,
      },
    },
    {
      key: 'installation.completed',
      value: {
        data: configRow.installation_completed,
      },
    },
  ];

  await knex('config').insert(config).returning('id');

  await knex('config').where('id', '=', configRow.id).delete();

  await knex.schema.alterTable('config', (table) => {
    table.dropColumn('installation_completed');
    table.dropColumn('logo_svg_data');
    table.dropColumn('palette_primary_dark');
    table.dropColumn('palette_primary_light');
    table.dropColumn('palette_primary_main');
    table.dropColumn('title');

    table.string('key').unique().notNullable().alter();
  });
}

function getValueForKey(rows, key) {
  const row = rows.find((row) => row.key === key);

  return row?.value?.data || null;
}
