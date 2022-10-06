import { IGlobalVariable } from '@automatisch/types';

type FindMessageOptions = {
  query: string;
  sortBy: string;
  sortDirection: string;
  count: number;
};

const findMessage = async ($: IGlobalVariable, options: FindMessageOptions) => {
  const headers = {
    Authorization: `Bearer ${$.auth.data.accessToken}`,
  };

  const params = {
    query: options.query,
    sort: options.sortBy,
    sort_dir: options.sortDirection,
    count: options.count || 1,
  };

  const response = await $.http.get('/search.messages', {
    headers,
    params,
  });

  const data = response.data;

  if (!data.ok) {
    if (data.error === 'missing_scope') {
      throw new Error(
        `Error occured while finding messages; ${data.error}: ${data.needed}`
      );
    }

    throw new Error(`Error occured while finding messages; ${data.error}`);
  }

  const messages = data.messages.matches;
  const message = messages?.[0];

  return message;
};

export default findMessage;
