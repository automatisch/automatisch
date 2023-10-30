import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List ticket forms',
  key: 'listTicketForms',

  async run($: IGlobalVariable) {
    const ticketForms: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      page: 1,
      per_page: 100,
    };

    let nextPage;
    do {
      const response = await $.http.get('/api/v2/ticket_forms', { params });
      const allTicketForms = response?.data?.ticket_forms;
      nextPage = response.data.next_page;
      params.page = params.page + 1;

      if (allTicketForms?.length) {
        for (const ticketForm of allTicketForms) {
          ticketForms.data.push({
            value: ticketForm.id,
            name: ticketForm.name,
          });
        }
      }
    } while (nextPage);

    return ticketForms;
  },
};
