import getPaginatedItems from '../../common/get-paginated-items.js';
import getProfileHeaders from '../../common/get-profile-headers.js';

const describeTemplate = (template) => {
  const details = [template.language, template.channels?.join('/')]
    .filter(Boolean)
    .join(', ');

  return details ? `${template.name} (${details})` : template.name;
};

export default {
  name: 'List templates',
  key: 'listTemplates',

  async run($) {
    const headers = getProfileHeaders($.step.parameters.senderProfileId);

    const approvedTemplates = await getPaginatedItems($, '/v3/templates', {
      itemsKey: 'templates',
      params: { status: 'APPROVED' },
      headers,
    });

    return {
      data: approvedTemplates.map((template) => ({
        value: template.id,
        name: describeTemplate(template),
      })),
    };
  },
};
