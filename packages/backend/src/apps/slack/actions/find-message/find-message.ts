import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type FindMessageOptions = {
  query: string;
  sortBy: string;
  sortDirection: string;
  count: number;
};

const findMessage = async ($: IGlobalVariable, options: FindMessageOptions) => {
  const message: {
    data?: IJSONObject;
    error?: IJSONObject;
  } = {};

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

  if (response.integrationError) {
    message.error = response.integrationError;
    return message;
  }

  const data = response.data;

  if (!data.ok) {
    message.error = data;
    return message;
  }

  const messages = data.messages.matches;
  message.data = messages?.[0];

  return message;
};

export default findMessage;
