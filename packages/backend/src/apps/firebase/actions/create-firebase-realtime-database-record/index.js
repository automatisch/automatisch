import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create Firebase Realtime Database Record',
  key: 'createFirebaseRealtimeDatabaseRecord',
  description: 'Creates a child object within your Firebase Realtime Database.',
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
    {
      label: 'Convert Numerics',
      key: 'convertNumerics',
      type: 'dropdown',
      required: false,
      description:
        "If any value represents a valid numerical value, whether it's an integer or a floating-point number, this field directs the database to store it as a numeric data type instead of a string.",
      variables: true,
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    {
      label: 'New ID',
      key: 'newId',
      type: 'string',
      required: false,
      description:
        'The key to use for this object, or leave it blank for Firebase to create one automatically.',
      variables: true,
    },
    {
      label: 'Data',
      key: 'childData',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Key',
          key: 'key',
          type: 'string',
          required: false,
          variables: true,
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string',
          required: false,
          variables: true,
        },
      ],
    },
  ],

  async run($) {
    let path = $.step.parameters.path;
    const { convertNumerics, newId, childData } = $.step.parameters;

    if (newId) {
      path = `${path}/${newId}.json`;
    } else {
      path = `${path}.json`;
    }

    const formattedChildObjectData = childData.reduce((result, entry) => {
      const key = entry?.key;
      const value = entry?.value;
      const isNumber = !isNaN(parseFloat(value));

      if (isNumber && convertNumerics) {
        result[key] = parseFloat(value);
      } else {
        result[key] = value;
      }

      return result;
    }, {});

    const body = formattedChildObjectData;

    const { data } = await $.http.post(path, body, {
      additionalProperties: {
        setFirestoreBaseUrl: false,
      },
    });

    $.setActionItem({
      raw: data,
    });
  },
});
