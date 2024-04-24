import defineTrigger from '../../../../helpers/define-trigger.js';
import unreadMailsInInbox from "./unread-mails-in-inbox.js";

export default defineTrigger({
  name: 'Unread mail in inbox',
  key: 'unreadMailsInInbox',
  pollInterval: 15,
  description: 'Triggers when you have unread mails in your inbox.',
  arguments: [
    {
      label: 'Choose Mail Folder',
      key: 'mailFolderId',
      type: 'dropdown',
      required: false,
      description:
        'The mail folder you want to check for unread mails. Defaults to the inbox folder.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listMailFolders',
          },
        ],
      },
    },
  ],

  async run($) {
    await unreadMailsInInbox($);
  },
});
