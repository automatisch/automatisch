import { useSearchParams } from 'react-router-dom';

import objectifyUrlSearchParams from 'helpers/objectifyUrlSearchParams';

export default function useFlowFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsObject = objectifyUrlSearchParams(searchParams);

  const { folderId, status } = searchParamsObject;
  const onlyOwnedFlows =
    searchParamsObject.onlyOwnedFlows === 'true' || undefined;

  const filterByStatus = (status) => {
    setSearchParams(() => {
      // eslint-disable-next-line no-unused-vars
      const { status: currentStatus, ...rest } = searchParamsObject;

      if (status) {
        return { ...rest, status };
      }

      return rest;
    });
  };

  const filterByOwnership = (onlyOwnedFlows) => {
    setSearchParams(() => {
      // eslint-disable-next-line no-unused-vars
      const { onlyOwnedFlows: currentOnlyOwnedFlows, ...rest } =
        searchParamsObject;

      if (onlyOwnedFlows) {
        return { ...rest, onlyOwnedFlows: true };
      }

      return rest;
    });
  };

  const enhanceExistingSearchParams = (key, value) => {
    const searchParamsObject = objectifyUrlSearchParams(searchParams);

    if (value === undefined) {
      // eslint-disable-next-line no-unused-vars
      const { [key]: keyToRemove, ...remainingSearchParams } =
        searchParamsObject;

      return new window.URLSearchParams(remainingSearchParams).toString();
    }

    return new window.URLSearchParams({
      ...searchParamsObject,
      [key]: value,
    }).toString();
  };

  return {
    filters: {
      folderId,
      status,
      onlyOwnedFlows,
    },
    filterByStatus,
    filterByOwnership,
    enhanceExistingSearchParams,
  };
}
