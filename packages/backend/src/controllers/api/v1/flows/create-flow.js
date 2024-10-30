import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const flow = await request.currentUser.$relatedQuery('flows').insertAndFetch({
    name: 'Name your flow',
  });

  await flow.createInitialSteps();

  renderObject(response, flow, { status: 201 });
};
