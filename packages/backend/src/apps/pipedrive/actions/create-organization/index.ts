import defineAction from '../../../../helpers/define-action';
import { filterProvidedFields } from '../../common/filter-provided-fields';

export default defineAction({
  name: 'Create organization',
  key: 'createOrganization',
  description: 'Creates a new organization.',
  arguments: [
    {
      label: 'Name',
      key: 'name',
      type: 'string' as const,
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Owner',
      key: 'ownerId',
      type: 'dropdown' as const,
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listUsers',
          },
        ],
      },
    },
    {
      label: 'Label',
      key: 'labelId',
      type: 'dropdown' as const,
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listOrganizationLabelField',
          },
        ],
      },
    },
  ],

  async run($) {
    const { name, ownerId, labelId } = $.step.parameters;

    const fields = {
      name: name,
      owner_id: ownerId,
      label: labelId,
    };

    const body = filterProvidedFields(fields);

    const {
      data: { data },
    } = await $.http.post('/api/v1/organizations', body);

    $.setActionItem({
      raw: data,
    });
  },
});
