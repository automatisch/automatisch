export const up = async (knex) => {
  await knex.schema.alterTable('executions', (table) => {
    table.string('status');
  });

  const batchSize = 5000;
  let lastProcessedId = null;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const executionsBatch = await knex('executions')
      .select('id')
      .whereNull('status')
      .modify((query) => {
        if (lastProcessedId) {
          query.where('id', '>', lastProcessedId); // Adjusted for lexicographic order
        }
      })
      .orderBy('id') // Ensure consistent ordering
      .limit(batchSize);

    if (executionsBatch.length === 0) break;

    const executionIds = executionsBatch.map((row) => row.id);

    await knex.raw(
      `
      WITH execution_statuses AS (
        SELECT 
          execution_id,
          CASE 
            WHEN bool_or(status = 'failure') THEN 'failure'
            ELSE 'success'
          END as derived_status
        FROM execution_steps
        WHERE execution_id = ANY(?)
        GROUP BY execution_id
      )
      UPDATE executions
      SET status = execution_statuses.derived_status
      FROM execution_statuses
      WHERE executions.id = execution_statuses.execution_id
    `,
      [executionIds]
    );

    lastProcessedId = executionsBatch[executionsBatch.length - 1].id;

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

export const down = async (knex) => {
  await knex.schema.alterTable('executions', (table) => {
    table.dropColumn('status');
  });
};
