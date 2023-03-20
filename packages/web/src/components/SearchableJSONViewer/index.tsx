import * as React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import throttle from 'lodash/throttle';
import isEmpty from 'lodash/isEmpty';
import forIn from 'lodash/forIn';
import isPlainObject from 'lodash/isPlainObject';
import { Box, Typography } from '@mui/material';

import { IJSONObject } from '@automatisch/types';
import JSONViewer from 'components/JSONViewer';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage';

type JSONViewerProps = {
  data: IJSONObject;
};

function aggregate(
  data: any,
  searchTerm: string,
  result = {},
  prefix: string[] = [],
  withinArray = false
) {
  if (withinArray) {
    const containerValue = get(result, prefix, []);

    result = aggregate(
      data,
      searchTerm,
      result,
      prefix.concat(containerValue.length.toString())
    );

    return result;
  }

  if (isPlainObject(data)) {
    forIn(data, (value, key) => {
      const fullKey = [...prefix, key];

      if (key.toLowerCase().includes(searchTerm)) {
        set(result, fullKey, value);
        return;
      }

      result = aggregate(value, searchTerm, result, fullKey);
    });
  }

  if (Array.isArray(data)) {
    forIn(data, (value) => {
      result = aggregate(value, searchTerm, result, prefix, true);
    });
  }

  if (
    ['string', 'number'].includes(typeof data) &&
    String(data).toLowerCase().includes(searchTerm)
  ) {
    set(result, prefix, data);
  }

  return result;
}

const SearchableJSONViewer = ({ data }: JSONViewerProps) => {
  const [filteredData, setFilteredData] = React.useState<IJSONObject | null>(
    data
  );
  const formatMessage = useFormatMessage();

  const onSearchChange = React.useMemo(
    () =>
      throttle((event: React.ChangeEvent) => {
        const search = (event.target as HTMLInputElement).value.toLowerCase();

        if (!search) {
          setFilteredData(data);
          return;
        }

        const newFilteredData = aggregate(data, search);

        if (isEmpty(newFilteredData)) {
          setFilteredData(null);
        } else {
          setFilteredData(newFilteredData);
        }
      }, 400),
    [data]
  );

  return (
    <>
      <Box my={2}>
        <SearchInput onChange={onSearchChange} />
      </Box>
      {filteredData && <JSONViewer data={filteredData} />}
      {!filteredData && (
        <Typography>{formatMessage('jsonViewer.noDataFound')}</Typography>
      )}
    </>
  );
};

export default SearchableJSONViewer;
