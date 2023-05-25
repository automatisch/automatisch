import type { IFieldDropdownOption } from '@automatisch/types';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import throttle from 'lodash/throttle';
import * as React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { Typography } from '@mui/material';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage';
import { SearchInputWrapper } from './style';

interface OptionsProps {
  data: readonly IFieldDropdownOption[];
  onOptionClick: (event: React.MouseEvent, option: any) => void;
};

const SHORT_LIST_LENGTH = 4;
const LIST_ITEM_HEIGHT = 64;

const computeListHeight = (currentLength: number) => {
  const numberOfRenderedItems = Math.min(SHORT_LIST_LENGTH, currentLength);
  return LIST_ITEM_HEIGHT * numberOfRenderedItems;
}

const renderItemFactory = ({ onOptionClick }: Pick<OptionsProps, 'onOptionClick'>) => (props: ListChildComponentProps) => {
  const { index, style, data } = props;

  const suboption = data[index];

  return (
    <ListItemButton
      sx={{ pl: 4 }}
      divider
      onClick={(event) => onOptionClick(event, suboption)}
      data-test="power-input-suggestion-item"
      key={index}
      style={style}
    >
      <ListItemText
        primary={suboption.label}
        primaryTypographyProps={{
          variant: 'subtitle1',
          title: 'Property name',
          sx: { fontWeight: 700 },
        }}
        secondary={suboption.value}
        secondaryTypographyProps={{
          variant: 'subtitle2',
          title: 'Sample value',
          noWrap: true,
        }}
      />
    </ListItemButton>
  );
};

const Options = (props: OptionsProps) => {
  const formatMessage = useFormatMessage();
  const {
    data,
    onOptionClick
  } = props;
  const [filteredData, setFilteredData] = React.useState<readonly IFieldDropdownOption[]>(
    data
  );

  React.useEffect(function syncOptions() {
    setFilteredData((filteredData) => {
      if (filteredData.length === 0 && filteredData.length !== data.length) {
        return data;
      }

      return filteredData;
    })
  }, [data]);

  const renderItem = React.useMemo(() => renderItemFactory({
    onOptionClick
  }), [onOptionClick]);

  const onSearchChange = React.useMemo(
  () =>
    throttle((event: React.ChangeEvent) => {
      const search = (event.target as HTMLInputElement).value.toLowerCase();

      if (!search) {
        setFilteredData(data);
        return;
      }

      const newFilteredData = data.filter(option => `${option.label}\n${option.value}`.toLowerCase().includes(search.toLowerCase()));

      setFilteredData(newFilteredData);
    }, 400),
  [data]
);

  return (
    <>
      <SearchInputWrapper>
        <SearchInput onChange={onSearchChange} />
      </SearchInputWrapper>

      <FixedSizeList
        height={computeListHeight(filteredData.length)}
        width="100%"
        itemSize={LIST_ITEM_HEIGHT}
        itemCount={filteredData.length}
        overscanCount={2}
        itemData={filteredData}
      >
        {renderItem}
      </FixedSizeList>

      {filteredData.length === 0 && (
        <Typography sx={{ p: (theme) => theme.spacing(0, 0, 2, 2) }}>
          {formatMessage('customAutocomplete.noOptions')}
        </Typography>
      )}
    </>
  );
};


export default Options;
