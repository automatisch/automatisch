import { IGlobalVariable } from '@automatisch/types';

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

  if (!data.ok && data) {
    throw new Error(JSON.stringify(response.data));
  }

  $.setActionItem({ raw: data?.messages.matches[0] });
};

export default findMessage;
