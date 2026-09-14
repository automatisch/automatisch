import getProfileHeaders from '../../common/get-profile-headers.js';
import { getTemplateParameterKey } from '../../common/template-parameters.js';
import { assertUuid } from '../../common/validators.js';

export default {
  name: 'List template parameters',
  key: 'listTemplateParameters',

  async run($) {
    const { templateId, senderProfileId } = $.step.parameters;

    if (!templateId) return [];

    const headers = getProfileHeaders(senderProfileId);

    const response = await $.http.get(
      `/v3/templates/${encodeURIComponent(assertUuid(templateId, 'Template'))}`,
      { headers }
    );

    const variables = response.data?.data?.variables ?? [];

    return variables.map((variableName) => ({
      label: `Template variable: ${variableName}`,
      key: getTemplateParameterKey(variableName),
      type: 'string',
      required: true,
      description: `Value for the "${variableName}" variable of the selected template.`,
      variables: true,
    }));
  },
};
