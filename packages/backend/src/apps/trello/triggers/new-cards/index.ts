import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New cards',
  key: 'newCards',
  pollInterval: 15,
  description: 'Triggers upon the addition of a new card.',
  arguments: [
    {
      label: 'Board',
      key: 'boardId',
      type: 'dropdown' as const,
      required: false,
      description:
        'Selecting a board initiates the trigger for newly added cards on that board.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listBoards',
          },
        ],
      },
    },
    {
      label: 'List',
      key: 'listId',
      type: 'dropdown' as const,
      required: false,
      dependsOn: ['parameters.boardId'],
      description: 'Requires to opt for a board.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listBoardLists',
          },
          {
            name: 'parameters.boardId',
            value: '{parameters.boardId}',
          },
        ],
      },
    },
    {
      label: 'Filter',
      key: 'filter',
      type: 'dropdown' as const,
      required: false,
      description: 'Default is open.',
      variables: true,
      options: [
        {
          label: 'open',
          value: 'open',
        },
        {
          label: 'closed',
          value: 'closed',
        },
        {
          label: 'all',
          value: 'all',
        },
      ],
    },
  ],

  async run($) {
    const { boardId, listId, filter } = $.step.parameters;

    if (boardId && !listId) {
      const cardFilter = filter || 'open';

      const { data } = await $.http.get(
        `/1/boards/${boardId}/cards/${cardFilter}`
      );

      if (data) {
        for (const card of data) {
          $.pushTriggerItem({
            raw: card,
            meta: {
              internalId: card.id,
            },
          });
        }
      }
    } else if (listId) {
      const { data } = await $.http.get(`1/lists/${listId}/cards`);

      if (data) {
        for (const card of data) {
          $.pushTriggerItem({
            raw: card,
            meta: {
              internalId: card.id,
            },
          });
        }
      }
    } else {
      const { data } = await $.http.get(`/1/members/me/cards`);

      if (data) {
        for (const card of data) {
          $.pushTriggerItem({
            raw: card,
            meta: {
              internalId: card.id,
            },
          });
        }
      }
    }
  },
});
