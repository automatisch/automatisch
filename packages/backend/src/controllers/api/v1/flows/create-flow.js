import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  let flow = await request.currentUser.$relatedQuery('flows').insert({
    name: 'Name your flow',
  });

  flow = await flow.createInitialSteps();

  renderObject(response, flow, { status: 201 });
};
