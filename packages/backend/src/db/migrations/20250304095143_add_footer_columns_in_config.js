export async function up(knex) {
  await knex.schema.table('config', (table) => {
    table.boolean('enable_footer').defaultTo(false);
    table.text('footer_logo_svg_data');
    table.string('footer_copyright_text');
    table.string('footer_background_color');
    table.string('footer_text_color');
    table.string('footer_docs_url');
    table.string('footer_tos_url');
    table.string('footer_privacy_policy_url');
    table.string('footer_imprint_url');
  });
}

export async function down(knex) {
  await knex.schema.table('config', (table) => {
    table.dropColumn('enable_footer');
    table.dropColumn('footer_copyright_text');
    table.dropColumn('footer_logo_svg_data');
    table.dropColumn('footer_background_color');
    table.dropColumn('footer_text_color');
    table.dropColumn('footer_docs_url');
    table.dropColumn('footer_tos_url');
    table.dropColumn('footer_privacy_policy_url');
    table.dropColumn('footer_imprint_url');
  });
}
