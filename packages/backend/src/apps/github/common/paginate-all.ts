import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import type { AxiosResponse } from 'axios';
import parseLinkHeader from '../../../helpers/parse-header-link';

type TResponse = {
  data: IJSONObject[];
  error?: IJSONObject;
};

export default async function paginateAll(
  $: IGlobalVariable,
  request: Promise<AxiosResponse>
) {
  const response = await request;
  const aggregatedResponse: TResponse = {
    data: [...response.data],
  };

  let links = parseLinkHeader(response.headers.link);

  while (links.next) {
    const nextPageResponse = await $.http.request({
      ...response.config,
      url: links.next.uri,
    });

    aggregatedResponse.data.push(...nextPageResponse.data);
    links = parseLinkHeader(nextPageResponse.headers.link);
  }

  return aggregatedResponse;
}
