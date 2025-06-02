import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find Firebase Realtime Database Record',
  key: 'findFirebaseRealtimeDatabaseRecord',
  description: 'Finds a child object in Firebase Realtime Database.',
  arguments: [
    {
      label: 'Path',
      key: 'path',
      type: 'string',
      required: true,
      description:
        "Indicate the path to the key of the object where the child objects to be queried are located, for example, 'foo/bar/here'.",
      variables: true,
    },
  ],

  async run($) {
    const { path } = $.step.parameters;

    const { data } = await $.http.get(`${path}.json`, {
      additionalProperties: {
        setFirestoreBaseUrl: false,
      },
    });

    $.setActionItem({
      raw: data,
    });
  },
});
