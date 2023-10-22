import defineAction from '../../../../helpers/define-action';
import { filterProvidedFields } from '../../common/filter-provided-fields';

export default defineAction({
  name: 'Create note',
  key: 'createNote',
  description: 'Creates a new note.',
  arguments: [
    {
      label: 'Content',
      key: 'content',
      type: 'string' as const,
      required: true,
      description: 'Supports some HTML formatting.',
      variables: true,
    },
    {
      label: 'Deal',
      key: 'dealId',
      type: 'dropdown' as const,
      required: false,
      description:
        'Note must be associated with at least one deal, person, organization, or lead.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDeals',
          },
        ],
      },
    },
    {
      label: 'Pin note on specified deal?',
      key: 'pinnedDeal',
      type: 'dropdown' as const,
      required: false,
      description: '',
      options: [
        {
          label: 'No',
          value: 0,
        },
        {
          label: 'Yes',
          value: 1,
        },
      ],
    },
    {
      label: 'Person',
      key: 'personId',
      type: 'dropdown' as const,
      required: false,
      description:
        'Note must be associated with at least one deal, person, organization, or lead.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listPersons',
          },
        ],
      },
    },
    {
      label: 'Pin note on specified person?',
      key: 'pinnedPerson',
      type: 'dropdown' as const,
      required: false,
      description: '',
      options: [
        {
          label: 'No',
          value: 0,
        },
        {
          label: 'Yes',
          value: 1,
        },
      ],
    },
    {
      label: 'Organization',
      key: 'organizationId',
      type: 'dropdown' as const,
      required: false,
      description:
        'Note must be associated with at least one deal, person, organization, or lead.',
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
      label: 'Pin note on specified organization?',
      key: 'pinnedOrganization',
      type: 'dropdown' as const,
      required: false,
      description: '',
      options: [
        {
          label: 'No',
          value: 0,
        },
        {
          label: 'Yes',
          value: 1,
        },
      ],
    },
    {
      label: 'Lead',
      key: 'leadId',
      type: 'dropdown' as const,
      required: false,
      description:
        'Note must be associated with at least one deal, person, organization, or lead.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listLeads',
          },
        ],
      },
    },
    {
      label: 'Pin note on specified lead?',
      key: 'pinnedLead',
      type: 'dropdown' as const,
      required: false,
      description: '',
      options: [
        {
          label: 'No',
          value: 0,
        },
        {
          label: 'Yes',
          value: 1,
        },
      ],
    },
  ],

  async run($) {
    const {
      content,
      dealId,
      pinnedDeal,
      personId,
      pinnedPerson,
      organizationId,
      pinnedOrganization,
      leadId,
      pinnedLead,
    } = $.step.parameters;

    const fields = {
      content: content as string,
      deal_id: dealId as number,
      pinned_to_deal_flag: pinnedDeal as number,
      person_id: personId as number,
      pinned_to_person_flag: pinnedPerson as number,
      org_id: organizationId as number,
      pinned_to_organization_flag: pinnedOrganization as number,
      lead_id: leadId as string,
      pinned_to_lead_flag: pinnedLead as number,
    };

    const body = filterProvidedFields(fields);

    const {
      data: { data },
    } = await $.http.post('/api/v1/notes', body);

    $.setActionItem({
      raw: data,
    });
  },
});
