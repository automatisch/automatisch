/**
 * Optional sender profile selector shared by every action and trigger. The
 * value is a profile UUID and is only meaningful for organization API keys.
 */
const senderProfileArgument = {
  label: 'Sender Profile',
  key: 'senderProfileId',
  type: 'dropdown',
  required: false,
  description:
    'Organization accounts only. Act on behalf of one of your sender profiles; leave empty to use the account that owns the API key.',
  variables: false,
  value: '',
  source: {
    type: 'query',
    name: 'getDynamicData',
    arguments: [
      {
        name: 'key',
        value: 'listSenderProfiles',
      },
    ],
  },
};

export default senderProfileArgument;
