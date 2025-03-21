import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import api from 'helpers/api';
import objectifyUrlSearchParams from 'helpers/objectifyUrlSearchParams';

export default function useFlowFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsObject = objectifyUrlSearchParams(searchParams);

  const { folderId, status } = searchParamsObject;
  const onlyOwnedFlows =
    searchParamsObject.onlyOwnedFlows === 'true' || undefined;

  const filterByStatus = (status) => {
    setSearchParams((current) => {
      const { status: currentStatus, ...rest } = searchParamsObject;

      if (status) {
        return { ...rest, status };
      }

      return rest;
    });
  };

  const filterByOwnership = (onlyOwnedFlows) => {
    setSearchParams((current) => {
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
      const { [key]: keyToRemove, ...remainingSearchParams } =
        searchParamsObject;

      return new URLSearchParams(remainingSearchParams).toString();
    }

    return new URLSearchParams({
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
