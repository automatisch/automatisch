import { IJSONArray, IJSONObject } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create card',
  key: 'createCard',
  description: 'Creates a new card within a specified board and list.',
  arguments: [
    {
      label: 'Board',
      key: 'boardId',
      type: 'dropdown' as const,
      required: true,
      description: '',
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
      required: true,
      dependsOn: ['parameters.boardId'],
      description: '',
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
      label: 'Name',
      key: 'name',
      type: 'string' as const,
      required: true,
      variables: true,
      description: '',
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string' as const,
      required: false,
      variables: true,
      description: '',
    },

    {
      label: 'Label',
      key: 'label',
      type: 'dropdown' as const,
      required: false,
      dependsOn: ['parameters.boardId'],
      description: 'Select a color tag to attach to the card.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listBoardLabels',
          },
          {
            name: 'parameters.boardId',
            value: '{parameters.boardId}',
          },
        ],
      },
    },
    {
      label: 'Card Position',
      key: 'cardPosition',
      type: 'dropdown' as const,
      required: false,
      description: '',
      variables: true,
      options: [
        {
          label: 'top',
          value: 'top',
        },
        {
          label: 'bottom',
          value: 'bottom',
        },
      ],
    },
    {
      label: 'Members',
      key: 'memberIds',
      type: 'dynamic' as const,
      required: false,
      description: '',
      fields: [
        {
          label: 'Member',
          key: 'memberId',
          type: 'dropdown' as const,
          required: false,
          dependsOn: ['parameters.boardId'],
          description: '',
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listMembers',
              },
              {
                name: 'parameters.boardId',
                value: '{parameters.boardId}',
              },
            ],
          },
        },
      ],
    },
    {
      label: 'Due Date',
      key: 'dueDate',
      type: 'string' as const,
      required: false,
      variables: true,
      description: 'Format: mm-dd-yyyy HH:mm:ss or yyyy-MM-dd HH:mm:ss.',
    },
    {
      label: 'URL Attachment',
      key: 'urlSource',
      type: 'string' as const,
      required: false,
      variables: true,
      description: 'A URL to attach to the card.',
    },
  ],

  async run($) {
    const {
      listId,
      name,
      description,
      cardPosition,
      dueDate,
      label,
      urlSource,
    } = $.step.parameters;

    const memberIds = $.step.parameters.memberIds as IJSONArray;
    const idMembers = memberIds.map(
      (memberId: IJSONObject) => memberId.memberId
    );

    const fields = {
      name,
      desc: description,
      idList: listId,
      pos: cardPosition,
      due: dueDate,
      idMembers: idMembers.join(','),
      idLabels: label,
      urlSource,
    };

    const response = await $.http.post('/1/cards', fields);

    $.setActionItem({ raw: response.data });
  },
});
