import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import { Method } from 'axios';

type IGenereateRequestOptons = {
  requestPath: string;
  method: string;
  data?: IJSONObject;
};

const generateRequest = async (
  $: IGlobalVariable,
  options: IGenereateRequestOptons
) => {
  const { requestPath, method, data } = options;

  const response = await $.http.request({
    url: requestPath,
    method: method as Method,
    data,
    headers: {
      Authorization: `Bearer ${$.auth.data.accessToken}`
    },
  });

  return response;
};

export default generateRequest;
