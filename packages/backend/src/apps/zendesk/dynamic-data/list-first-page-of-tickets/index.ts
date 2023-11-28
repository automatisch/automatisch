import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List first page of tickets',
  key: 'listFirstPageOfTickets',

  async run($: IGlobalVariable) {
    const tickets: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      'page[size]': 100,
      sort: '-id',
    };

    const response = await $.http.get('/api/v2/tickets', { params });
    const allTickets = response.data.tickets;

    if (allTickets?.length) {
      for (const ticket of allTickets) {
        tickets.data.push({
          value: ticket.id,
          name: ticket.subject,
        });
      }
    }

    return tickets;
  },
};
