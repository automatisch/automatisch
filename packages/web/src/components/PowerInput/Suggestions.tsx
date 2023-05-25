import type { IStep } from '@automatisch/types';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import throttle from 'lodash/throttle';
import * as React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage';

type SuggestionsProps = {
  data: {
    id: string;
    name: string;
    output: Record<string, unknown>[]
  }[];
  onSuggestionClick: (variable: any) => void;
};

const SHORT_LIST_LENGTH = 4;
const LIST_ITEM_HEIGHT = 64;

const computeListHeight = (currentLength: number) => {
  const numberOfRenderedItems = Math.min(SHORT_LIST_LENGTH, currentLength);
  return LIST_ITEM_HEIGHT * numberOfRenderedItems;
}

const getPartialArray = (array: any[], length = array.length) => {
  return array.slice(0, length);
};

const renderItemFactory = ({ onSuggestionClick }: Pick<SuggestionsProps, 'onSuggestionClick'>) => (props: ListChildComponentProps) => {
  const { index, style, data } = props;

  const suboption = data[index];

  return (
    <ListItemButton
      sx={{ pl: 4 }}
      divider
      onClick={() => onSuggestionClick(suboption)}
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
        secondary={suboption.sampleValue || ''}
        secondaryTypographyProps={{
          variant: 'subtitle2',
          title: 'Sample value',
          noWrap: true,
        }}
      />
    </ListItemButton>
  );
}

const Suggestions = (props: SuggestionsProps) => {
  const formatMessage = useFormatMessage();
  const {
    data,
    onSuggestionClick = () => null
  } = props;
  const [current, setCurrent] = React.useState<number | null>(0);
  const [listLength, setListLength] = React.useState<number>(SHORT_LIST_LENGTH);
  const [filteredData, setFilteredData] = React.useState<any[]>(
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
    onSuggestionClick
  }), [onSuggestionClick]);

  const expandList = () => {
    setListLength(Infinity);
  };

  const collapseList = () => {
    setListLength(SHORT_LIST_LENGTH);
  };

  React.useEffect(() => {
    setListLength(SHORT_LIST_LENGTH);
  }, [current]);

  const onSearchChange = React.useMemo(
    () =>
      throttle((event: React.ChangeEvent) => {
        const search = (event.target as HTMLInputElement).value.toLowerCase();

        if (!search) {
          setFilteredData(data);
          return;
        }

        const newFilteredData = data
          .map((stepWithOutput) => {
            return {
              id: stepWithOutput.id,
              name: stepWithOutput.name,
              output: stepWithOutput.output
                .filter(option => `${option.label}\n${option.sampleValue}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
                )
            }
          })
          .filter((stepWithOutput) => stepWithOutput.output.length);

        setFilteredData(newFilteredData);
      }, 400),
    [data]
  );

  return (
    <Paper elevation={0} sx={{ width: '100%' }}>
      <Box px={2} pb={2}>
        <SearchInput onChange={onSearchChange} />
      </Box>

      {filteredData.length > 0 && (
        <List disablePadding>
          {filteredData.map((option: IStep, index: number) => (
            <React.Fragment key={`${index}-${option.name}`}>
              <ListItemButton
                divider
                onClick={() =>
                  setCurrent((currentIndex) =>
                    currentIndex === index ? null : index
                  )
                }
                sx={{ py: 0.5 }}
              >
                <ListItemText primary={option.name} />

                {!!option.output?.length &&
                  (current === index ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>

              <Collapse in={current === index || filteredData.length === 1} timeout="auto" unmountOnExit>
                <FixedSizeList
                  height={computeListHeight(getPartialArray((option.output as any) || [], listLength).length)}
                  width="100%"
                  itemSize={LIST_ITEM_HEIGHT}
                  itemCount={getPartialArray((option.output as any) || [], listLength).length}
                  overscanCount={2}
                  itemData={getPartialArray((option.output as any) || [], listLength)}
                  data-test="power-input-suggestion-group"
                >
                  {renderItem}
                </FixedSizeList>

                {(option.output?.length || 0) > listLength && (
                  <Button fullWidth onClick={expandList}>
                    Show all
                  </Button>
                )}

                {listLength === Infinity && (
                  <Button fullWidth onClick={collapseList}>
                    Show less
                  </Button>
                )}
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      )}

      {filteredData.length === 0 && (
        <Typography sx={{ p: (theme) => theme.spacing(0, 0, 2, 2) }}>
          {formatMessage('powerInputSuggestions.noOptions')}
        </Typography>
      )}
    </Paper>
  );
};

export default Suggestions;
