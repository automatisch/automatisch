import { IGlobalVariable } from '@automatisch/types';

const newResponses = async ($: IGlobalVariable) => {
  const params = {
    pageToken: undefined as unknown as string,
  };

  do {
    const pathname = `/v1/forms/${$.step.parameters.formId}/responses`;
    const { data } = await $.http.get(pathname, { params });
    params.pageToken = data.nextPageToken;

    if (data.responses?.length) {
      for (const formResponse of data.responses) {
        const dataItem = {
          raw: formResponse,
          meta: {
            internalId: formResponse.responseId,
          },
        };

        $.pushTriggerItem(dataItem);
      }
    }
  } while (params.pageToken);
};

export default newResponses;
