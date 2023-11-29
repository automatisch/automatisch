import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Delete ticket',
  key: 'deleteTicket',
  description: 'Deletes an existing ticket.',
  arguments: [
    {
      label: 'Ticket',
      key: 'ticketId',
      type: 'dropdown' as const,
      required: true,
      variables: true,
      description: 'Select the ticket you want to delete.',
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listFirstPageOfTickets',
          },
        ],
      },
    },
  ],

  async run($) {
    const ticketId = $.step.parameters.ticketId;

    const response = await $.http.delete(`/api/v2/tickets/${ticketId}`);

    $.setActionItem({ raw: { data: response.data } });
  },
});
