const { expect } = require('../fixtures/index');

export const expectNoDelayedJobForFlow = async (flowId, request) => {
  const token = btoa(`${process.env.BULLMQ_DASHBOARD_USERNAME}:${process.env.BULLMQ_DASHBOARD_PASSWORD}`);
  const queues = await request.get(`${process.env.BACKEND_APP_URL}/admin/queues/api/queues?activeQueue=flow&status=delayed&page=1`, {
    headers: {'Authorization': `Basic ${token}`}
  });
  const queuesJsonResponse = await queues.json();
  const flowQueue = queuesJsonResponse.queues.find(queue => queue.name === "flow");
  await expect(flowQueue.jobs.find(job => job.name === `flow-${flowId}`)).toBeUndefined();
};
