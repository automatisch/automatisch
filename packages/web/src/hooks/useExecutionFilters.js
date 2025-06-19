import { useSearchParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import objectifyUrlSearchParams from 'helpers/objectifyUrlSearchParams';

export default function useExecutionFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsObject = objectifyUrlSearchParams(searchParams);

  const {
    folderId,
    startDateTime: startDateTimeString,
    endDateTime: endDateTimeString,
    status,
  } = searchParamsObject;

  const startDateTime = parseInt(startDateTimeString, 10);
  const endDateTime = parseInt(endDateTimeString, 10);

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

  const filterByStartDateTime = (startDateTime) => {
    const startDateTimeString = startDateTime?.toMillis();

    setSearchParams(() => {
      // eslint-disable-next-line no-unused-vars
      const { startDateTime: currentStartDateTime, ...rest } =
        searchParamsObject;

      if (startDateTimeString) {
        return { ...rest, startDateTime: startDateTimeString };
      }

      return rest;
    });
  };

  const filterByEndDateTime = (endDateTime) => {
    const endDateTimeString = endDateTime?.endOf('day').toMillis();

    setSearchParams(() => {
      // eslint-disable-next-line no-unused-vars
      const { endDateTime: currentEndDateTime, ...rest } = searchParamsObject;

      if (endDateTimeString) {
        return { ...rest, endDateTime: endDateTimeString };
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
      startDateTime: startDateTime
        ? DateTime.fromMillis(startDateTime)
        : undefined,
      endDateTime: endDateTime ? DateTime.fromMillis(endDateTime) : undefined,
      status,
    },
    requestFriendlyFilters: {
      ...(startDateTime && { startDateTime }),
      ...(endDateTime && { endDateTime }),
      ...(status && { status }),
      ...(folderId && { folderId }),
    },
    filterByStartDateTime,
    filterByEndDateTime,
    filterByStatus,
    enhanceExistingSearchParams,
  };
}
