export async function up(knex) {
  await knex.schema.table('config', (table) => {
    table.boolean('enable_footer').defaultTo(false);
    table.text('footer_logo_svg_data');
    table.text('footer_copyright_text');
    table.text('footer_background_color');
    table.text('footer_text_color');
    table.text('footer_docs_link');
    table.text('footer_tos_link');
    table.text('footer_privacy_policy_link');
    table.text('footer_imprint_link');
  });
}

export async function down(knex) {
  await knex.schema.table('config', (table) => {
    table.dropColumn('enable_footer');
    table.dropColumn('footer_copyright_text');
    table.dropColumn('footer_logo_svg_data');
    table.dropColumn('footer_background_color');
    table.dropColumn('footer_text_color');
    table.dropColumn('footer_docs_link');
    table.dropColumn('footer_tos_link');
    table.dropColumn('footer_privacy_policy_link');
    table.dropColumn('footer_imprint_link');
  });
}
