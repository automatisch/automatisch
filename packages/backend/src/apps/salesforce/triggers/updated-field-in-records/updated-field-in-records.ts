import { IGlobalVariable } from '@automatisch/types';

function getQuery(object: string, limit: number, offset: number) {
  return `
    SELECT
      FIELDS(ALL)
    FROM
      ${object}
    ORDER BY LastModifiedDate DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
}

const updatedFieldInRecord = async ($: IGlobalVariable): Promise<void> => {
  const limit = 200;
  const field = $.step.parameters.field as string;
  const object = $.step.parameters.object as string;

  let response;
  let offset = 0;
  do {
    const options = {
      params: {
        q: getQuery(object, limit, offset),
      },
    };

    response = await $.http.get('/services/data/v56.0/query', options);
    const records = response.data.records;

    for (const record of records) {
      $.pushTriggerItem({
        raw: record,
        meta: {
          internalId: `${record.Id}-${record[field]}`,
        },
      });
    }

    offset = offset + limit;
  } while (response.data.records?.length === limit);
};

export default updatedFieldInRecord;
