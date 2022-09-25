import * as React from 'react';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import MuiListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import type { IStep } from '@automatisch/types';

const ListItemText = styled(MuiListItemText)``;

type SuggestionsProps = {
  query?: string | null;
  index: number;
  data: any;
  onSuggestionClick: (variable: any) => void;
};

const SHORT_LIST_LENGTH = 4;
const LIST_HEIGHT = 256;

const getPartialFilteredArray = (array: any[], query = '', length = array.length) => {
  return array
    .filter((suboption: any) => suboption.name.includes(query))
    .slice(0, length);
}

const Suggestions = (props: SuggestionsProps) => {
  const {
    query = '',
    index: focusIndex,
    data,
    onSuggestionClick = () => null,
  } = props;
  const [current, setCurrent] = React.useState<number | null>(0);
  const [listLength, setListLength] = React.useState<number>(SHORT_LIST_LENGTH);

  const expandList = () => {
    setListLength(Infinity);
  };

  const collapseList = () => {
    setListLength(SHORT_LIST_LENGTH);
  }

  React.useEffect(() => {
    setListLength(SHORT_LIST_LENGTH);
  }, [current])

  return (
    <Paper
      elevation={5}
      sx={{ width: '100%' }}
    >
      <Typography variant="subtitle2" sx={{ p: 2, }}>Variables</Typography>
      <List
        disablePadding
      >
        {data.map((option: IStep, index: number) => (
          <>
            <ListItemButton
              divider
              onClick={() => setCurrent((currentIndex) => currentIndex === index ? null : index)}
              sx={{ py: 0.5, }}
            >
              <ListItemText
                primary={option.name}
              />

              {!!option.output?.length && (
                current === index ? <ExpandLess /> : <ExpandMore />
              )}
            </ListItemButton>

            <Collapse in={current === index} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ maxHeight: LIST_HEIGHT, overflowY: 'auto' }}>
                {getPartialFilteredArray(option.output as any || [], query as string, listLength)
                  .map((suboption: any, index: number) => (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      divider
                      onClick={() => onSuggestionClick(suboption)}
                      selected={focusIndex === index}>
                      <ListItemText
                        primary={suboption.name}
                        primaryTypographyProps={{
                          variant: 'subtitle1',
                          title: 'Property name',
                          sx: { fontWeight: 700 }
                        }}
                        secondary={suboption.value || ''}
                        secondaryTypographyProps={{
                          variant: 'subtitle2',
                          title: 'Sample value',
                          noWrap: true,
                        }}
                      />
                    </ListItemButton>
                  ))
                }
              </List>

              {option.output?.length > listLength && (
                <Button
                  fullWidth
                  onClick={expandList}
                >
                  Show all
                </Button>
              )}

              {listLength === Infinity && (
                <Button
                  fullWidth
                  onClick={collapseList}
                >
                  Show less
                </Button>
              )}
            </Collapse>
          </>
        ))}
      </List>
    </Paper>
  );
}

export default Suggestions;
