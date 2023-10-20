import defineAction from '../../../../helpers/define-action';
import { filterProvidedFields } from '../../common/filter-provided-fields';

type TEmail = {
  __id: string;
  email: string;
}[];

type TPhone = {
  __id: string;
  phone: string;
}[];

export default defineAction({
  name: 'Create person',
  key: 'createPerson',
  description: 'Creates a new person.',
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
      label: 'Organization',
      key: 'organizationId',
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
            value: 'listOrganizations',
          },
        ],
      },
    },
    {
      label: 'Emails',
      key: 'emails',
      type: 'dynamic' as const,
      required: false,
      description: '',
      fields: [
        {
          label: 'Email',
          key: 'email',
          type: 'string' as const,
          required: false,
          description: '',
          variables: true,
        },
      ],
    },
    {
      label: 'Phones',
      key: 'phones',
      type: 'dynamic' as const,
      required: false,
      description: '',
      fields: [
        {
          label: 'Phone',
          key: 'phone',
          type: 'string' as const,
          required: false,
          description: '',
          variables: true,
        },
      ],
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
            value: 'listPersonLabelField',
          },
        ],
      },
    },
  ],

  async run($) {
    const { name, ownerId, organizationId, labelId } = $.step.parameters;
    const emails = $.step.parameters.emails as TEmail;
    const emailValues = emails.map((entry) => entry.email);
    const phones = $.step.parameters.phones as TPhone;
    const phoneValues = phones.map((entry) => entry.phone);

    const fields = {
      name: name,
      owner_id: ownerId,
      org_id: organizationId,
      email: emailValues,
      phone: phoneValues,
      label: labelId,
    };

    const body = filterProvidedFields(fields);

    const {
      data: { data },
    } = await $.http.post('/api/v1/persons', body);

    $.setActionItem({
      raw: data,
    });
  },
});
