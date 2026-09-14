export const MAX_PAGE_SIZE = 100;
export const MAX_DYNAMIC_DATA_PAGES = 10;

/**
 * Collects items from a paginated Sent list endpoint. Pagination is bounded to
 * keep dynamic data dropdowns responsive and to avoid unbounded API usage.
 */
const getPaginatedItems = async (
  $,
  path,
  { itemsKey, params = {}, headers = {}, maxPages = MAX_DYNAMIC_DATA_PAGES }
) => {
  const items = [];

  for (let page = 1; page <= maxPages; page++) {
    const response = await $.http.get(path, {
      params: { ...params, page, page_size: MAX_PAGE_SIZE },
      headers,
    });

    const data = response.data?.data ?? {};

    items.push(...(data[itemsKey] ?? []));

    if (!data.pagination?.has_more) break;
  }

  return items;
};

export default getPaginatedItems;
