const { pgPool } = require('./postgres-config');
const { expect } = require('../../fixtures/index');

export const flowShouldNotHavePublishedAtDateFilled = async (flowId) => {
  const queryFlow = {
    text: 'SELECT * FROM flows WHERE id = $1',
    values: [flowId]
  };

  try {
    const queryFlowResult = await pgPool.query(queryFlow);
    expect(queryFlowResult.rowCount).toEqual(1);
    expect(queryFlowResult.rows[0].published_at).toBeNull();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
