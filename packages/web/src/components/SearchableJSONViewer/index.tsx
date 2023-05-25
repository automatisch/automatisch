import * as React from 'react';
import throttle from 'lodash/throttle';
import isEmpty from 'lodash/isEmpty';
import { Box, Typography } from '@mui/material';

import { IJSONObject } from '@automatisch/types';
import JSONViewer from 'components/JSONViewer';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage';
import filterObject from 'helpers/filterObject';

type JSONViewerProps = {
  data: IJSONObject;
};

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

        const newFilteredData = filterObject(data, search);

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
