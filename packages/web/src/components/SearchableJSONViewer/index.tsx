import * as React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import throttle from 'lodash/throttle';
import isEmpty from 'lodash/isEmpty';
import toPath from 'lodash/toPath';
import { Box, Typography } from '@mui/material';

import { IJSONObject, IJSONValue } from '@automatisch/types';
import JSONViewer from 'components/JSONViewer';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage';

type JSONViewerProps = {
  data: IJSONObject;
};

type Entry = [string, IJSONValue];

const SearchableJSONViewer = ({ data }: JSONViewerProps) => {
  const [filteredData, setFilteredData] = React.useState<IJSONObject | null>(
    data
  );
  const formatMessage = useFormatMessage();

  const allEntries = React.useMemo(() => {
    const entries: Entry[] = [];
    const collectEntries = (obj: IJSONObject, prefix?: string) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          entries.push([[prefix, key].filter(Boolean).join('.'), obj[key]]);
          collectEntries(
            obj[key] as IJSONObject,
            [prefix, key].filter(Boolean).join('.')
          );
        } else {
          entries.push([[prefix, key].filter(Boolean).join('.'), obj[key]]);
        }
      }
    };

    collectEntries(data);
    return entries;
  }, [data]);

  const onSearchChange = React.useMemo(
    () =>
      throttle((event: React.ChangeEvent) => {
        const search = (event.target as HTMLInputElement).value.toLowerCase();
        const newFilteredData: IJSONObject = {};

        if (!search) {
          setFilteredData(data);
          return;
        }

        allEntries.forEach(([key, value]) => {
          if (
            key.toLowerCase().includes(search) ||
            (typeof value !== 'object' &&
              value.toString().toLowerCase().includes(search))
          ) {
            const value = get(filteredData, key);
            set(newFilteredData, key, value);
            const keyPath = toPath(key);
            const parentKeyPath = keyPath.slice(0, keyPath.length - 1);
            const parentKey = parentKeyPath.join('.');
            const parentValue = get(newFilteredData, parentKey);
            if (Array.isArray(parentValue)) {
              const filteredParentValue = parentValue.filter(
                (item) => item !== undefined
              );
              set(newFilteredData, parentKey, filteredParentValue);
            }
          }
        });

        if (isEmpty(newFilteredData)) {
          setFilteredData(null);
        } else {
          setFilteredData(newFilteredData);
        }
      }, 400),
    [allEntries]
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
