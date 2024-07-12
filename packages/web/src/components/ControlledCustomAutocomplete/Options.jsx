import PropTypes from 'prop-types';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import throttle from 'lodash/throttle';
import * as React from 'react';
import { FixedSizeList } from 'react-window';
import { Typography } from '@mui/material';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage';
import { SearchInputWrapper } from './style';
import { FieldDropdownOptionPropType } from 'propTypes/propTypes';

const SHORT_LIST_LENGTH = 4;
const LIST_ITEM_HEIGHT = 64;

const computeListHeight = (currentLength) => {
  const numberOfRenderedItems = Math.min(SHORT_LIST_LENGTH, currentLength);
  return LIST_ITEM_HEIGHT * numberOfRenderedItems;
};

const Item = (props) => {
  const { index, style, data, onOptionClick } = props;
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

Item.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object,
  data: PropTypes.array.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

const renderItemFactory =
  ({ onOptionClick }) =>
  (props) => <Item onOptionClick={onOptionClick} {...props} />;

const Options = (props) => {
  const formatMessage = useFormatMessage();
  const { data, onOptionClick } = props;
  const [filteredData, setFilteredData] = React.useState(data);
  React.useEffect(
    function syncOptions() {
      setFilteredData((filteredData) => {
        if (filteredData.length === 0 && filteredData.length !== data.length) {
          return data;
        }
        return filteredData;
      });
    },
    [data],
  );
  const renderItem = React.useMemo(
    () =>
      renderItemFactory({
        onOptionClick,
      }),
    [onOptionClick],
  );
  const onSearchChange = React.useMemo(
    () =>
      throttle((event) => {
        const search = event.target.value.toLowerCase();
        if (!search) {
          setFilteredData(data);
          return;
        }
        const newFilteredData = data.filter((option) =>
          `${option.label}\n${option.value}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        );
        setFilteredData(newFilteredData);
      }, 400),
    [data],
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

Options.propTypes = {
  data: PropTypes.arrayOf(FieldDropdownOptionPropType).isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default Options;
