import defineAction from '../../../../helpers/define-action.js';
import isEmpty from 'lodash/isEmpty.js';
import omitBy from 'lodash/omitBy.js';

export default defineAction({
  name: 'Create event',
  key: 'createEvent',
  description: 'Creates a new event.',
  arguments: [
    {
      label: 'Organization',
      key: 'organizationId',
      type: 'dropdown',
      required: true,
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
      label: 'Name',
      key: 'name',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Summary',
      key: 'summary',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Event Start',
      key: 'eventStart',
      type: 'string',
      required: true,
      description: 'e.g. 2018-05-12T02:00:00Z',
      variables: true,
    },
    {
      label: 'Event End',
      key: 'eventEnd',
      type: 'string',
      required: true,
      description: 'e.g. 2018-05-12T02:00:00Z',
      variables: true,
    },
    {
      label: 'Venue',
      key: 'venueId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listVenues',
          },
          {
            name: 'parameters.organizationId',
            value: '{parameters.organizationId}',
          },
        ],
      },
    },
    {
      label: 'Currency',
      key: 'currencyId',
      type: 'dropdown',
      required: true,
      description: 'The ISO 4217 currency code.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listCurrency',
          },
        ],
      },
    },
    {
      label: 'Listed?',
      key: 'listed',
      type: 'dropdown',
      required: false,
      description: 'Can this event be found on Eventbrite?',
      variables: true,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
  ],

  async run($) {
    const {
      organizationId,
      name,
      summary,
      eventStart,
      eventEnd,
      venueId,
      currencyId,
      listed,
    } = $.step.parameters;

    const fields = {
      name: {
        html: name,
      },
      summary,
      start: {
        timezone: 'UTC',
        utc: eventStart,
      },
      end: {
        timezone: 'UTC',
        utc: eventEnd,
      },
      currency: currencyId,
      venue_id: venueId,
      listed,
    };

    const filteredFields = omitBy(fields, isEmpty);

    const { data } = await $.http.post(
      `/v3/organizations/${organizationId}/events/`,
      {
        event: filteredFields,
      }
    );

    $.setActionItem({
      raw: data,
    });
  },
});
