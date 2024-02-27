export default {
  name: 'List templates',
  key: 'listTemplates',

  async run($) {
    const templates = {
      data: [],
    };
    const workspaceId = $.step.parameters.workspaceId;
    let next = false;

    const params = {
      page: 'all',
      'q[workspace_id]': workspaceId,
    };

    if (!workspaceId) {
      return templates;
    }

    do {
      const { data } = await $.http.get('/v1/document_template_cards', params);
      next = data.meta.next_page;

      if (!data?.document_template_cards?.length) {
        return;
      }

      for (const template of data.document_template_cards) {
        templates.data.push({
          value: template.id,
          name: template.identifier,
        });
      }
    } while (next);

    return templates;
  },
};
