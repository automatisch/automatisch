import { IGlobalVariable, IActionOutput } from '@automatisch/types';

type FindMessageOptions = {
  query: string;
  sortBy: string;
  sortDirection: string;
  count: number;
};

const findMessage = async ($: IGlobalVariable, options: FindMessageOptions) => {
  const params = {
    query: options.query,
    sort: options.sortBy,
    sort_dir: options.sortDirection,
    count: options.count || 1,
  };

  const response = await $.http.get('/search.messages', {
    params,
  });

  const data = response.data;

  const message: IActionOutput = {
    data: {
      raw: data?.messages.matches[0],
    },
    error: response?.httpError || (!data.ok && data),
  };

  return message;
};

export default findMessage;
