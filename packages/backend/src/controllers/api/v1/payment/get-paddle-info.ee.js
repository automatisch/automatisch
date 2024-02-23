import { renderObject } from '../../../../helpers/renderer.js';
import Billing from '../../../../helpers/billing/index.ee.js';

export default async (request, response) => {
  const paddleInfo = Billing.paddleInfo;

  renderObject(response, paddleInfo);
};
