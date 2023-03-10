import * as React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import throttle from 'lodash/throttle';
import { Box } from '@mui/material';

import { IJSONObject, IJSONValue } from '@automatisch/types';
import JSONViewer from 'components/JSONViewer';
import SearchInput from 'components/SearchInput';

type JSONViewerProps = {
  data: IJSONObject;
};

type Entry = [string, IJSONValue];

const SearchableJSONViewer = ({ data }: JSONViewerProps) => {
  const [filteredData, setFilteredData] = React.useState(data);

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
          }
        });

        setFilteredData(newFilteredData);
      }, 400),
    [allEntries]
  );

  return (
    <>
      <Box mb={1} mt={2}>
        <SearchInput onChange={onSearchChange} />
      </Box>
      <JSONViewer data={filteredData} />
    </>
  );
};

export default SearchableJSONViewer;
