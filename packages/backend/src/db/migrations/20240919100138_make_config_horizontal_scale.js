function getValueForKey(rows, key) {
  const row = rows.find((row) => row.key === key);

  return row?.value?.data || null;
}

export async function up(knex) {
  await knex.schema.alterTable('config', (table) => {
    table.dropPrimary();
    table.dropUnique('key');
  });

  await knex.schema.renameTable('config', 'config_old');

  await knex.schema.createTable('config', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.boolean('installation_completed').defaultTo(false);
    table.text('logo_svg_data');
    table.text('palette_primary_dark');
    table.text('palette_primary_light');
    table.text('palette_primary_main');
    table.string('title');

    table.timestamps(true, true);
  });

  const oldConfig = await knex('config_old').select('key', 'value');

  const singletonData = {
    logo_svg_data: getValueForKey(oldConfig, 'logo.svgData'),
    palette_primary_dark: getValueForKey(oldConfig, 'palette.primary.dark'),
    palette_primary_light: getValueForKey(oldConfig, 'palette.primary.light'),
    palette_primary_main: getValueForKey(oldConfig, 'palette.primary.main'),
    title: getValueForKey(oldConfig, 'title'),
    installation_completed: getValueForKey(oldConfig, 'installation.completed'),
  };

  await knex('config').insert(singletonData);

  await knex.schema.dropTable('config_old');
}

export async function down(knex) {
  await knex.schema.alterTable('config', (table) => {
    table.dropPrimary();
  });

  await knex.schema.renameTable('config', 'config_old');

  await knex.schema.createTable('config', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('key').unique().notNullable();
    table.jsonb('value').notNullable().defaultTo({});

    table.timestamps(true, true);
  });

  const configRow = await knex('config_old').first();

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

  await knex('config').insert(config);

  await knex.schema.dropTable('config_old');
}
