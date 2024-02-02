import parseLinkHeader from '../../../helpers/parse-header-link.js';

export default async function paginateAll($, request) {
  const response = await request;
  const aggregatedResponse = {
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
