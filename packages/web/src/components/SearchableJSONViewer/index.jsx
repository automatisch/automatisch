import PropTypes from 'prop-types';
import * as React from 'react';
import throttle from 'lodash/throttle';
import isEmpty from 'lodash/isEmpty';
import { Box, Typography } from '@mui/material';
import JSONViewer from 'components/JSONViewer';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage';
import filterObject from 'helpers/filterObject';

const SearchableJSONViewer = ({ data }) => {
  const [filteredData, setFilteredData] = React.useState(data);
  const formatMessage = useFormatMessage();

  const onSearchChange = React.useMemo(
    () =>
      throttle((event) => {
        const search = event.target.value.toLowerCase();
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
    [data],
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

SearchableJSONViewer.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SearchableJSONViewer;
