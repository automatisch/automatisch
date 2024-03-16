import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const invoices = await request.currentUser.getInvoices();

  renderObject(response, invoices);
};
