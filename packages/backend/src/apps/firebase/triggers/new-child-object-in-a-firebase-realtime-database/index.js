import Crypto from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New child object in a firebase realtime database',
  key: 'newChildObjectInFirebaseRealtimeDatabase',
  pollInterval: 15,
  description:
    'Triggers when a new child object is generated within a specific path.',
  arguments: [
    {
      label: 'Path',
      key: 'path',
      type: 'string',
      required: true,
      description:
        "Indicate the path to the key of the object where the child objects to be queried are located, for example, 'foo/bar/here.json'.",
      variables: true,
    },
    {
      label: 'Order',
      key: 'order',
      type: 'string',
      required: false,
      description:
        'The key or path of the child that should be utilized for comparing objects/records. If unspecified, the order of $key is used.',
      variables: true,
    },
    {
      label: 'Location of newest objects',
      key: 'locationOfNewestObjects',
      type: 'dropdown',
      required: false,
      description:
        'Specifies whether the new 100 records are positioned at the "top" or the "bottom" of the ordering. If left unspecified, the assumption is that the bottom/last result represents the "newest objects" (limitToLast).',
      variables: true,
      options: [
        { label: 'Top of results', value: 'limitToFirst' },
        { label: 'Bottom of results', value: 'limitToLast' },
      ],
    },
  ],

  async run($) {
    const { path, order, locationOfNewestObjects } = $.step.parameters;

    const params = {};

    if (order) {
      params.orderBy = `"${order}"`;
    }

    if (locationOfNewestObjects) {
      params[`${locationOfNewestObjects}`] = 100;
    }

    const { data } = await $.http.get(path, {
      params,
      additionalProperties: {
        setFirestoreBaseUrl: false,
      },
    });

    if (!data) {
      return;
    }

    $.pushTriggerItem({
      raw: data,
      meta: {
        internalId: Crypto.randomUUID(),
      },
    });
  },
});
