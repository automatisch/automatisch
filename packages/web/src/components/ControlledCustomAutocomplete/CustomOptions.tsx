import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tab from '@mui/material/Tab';
import * as React from 'react';

import type { IFieldDropdownOption } from '@automatisch/types';
import Suggestions from 'components/PowerInput/Suggestions';
import TabPanel from 'components/TabPanel';

import Options from './Options';
import { Tabs } from './style';

interface CustomOptionsProps {
  open: boolean;
  anchorEl: any;
  data: any;
  options: readonly IFieldDropdownOption[];
  onSuggestionClick: any;
  onOptionClick: (event: React.MouseEvent, option: any) => void;
  onTabChange: (tabIndex: 0 | 1) => void;
  label?: string;
  initialTabIndex?: 0 | 1;
}

const CustomOptions = (props: CustomOptionsProps) => {
  const {
    open,
    anchorEl,
    data,
    options = [],
    onSuggestionClick,
    onOptionClick,
    onTabChange,
    label,
    initialTabIndex,
  } = props;

  const [activeTabIndex, setActiveTabIndex] = React.useState<
    number | undefined
  >(undefined);

  React.useEffect(
    function applyInitialActiveTabIndex() {
      setActiveTabIndex((currentActiveTabIndex) => {
        if (currentActiveTabIndex === undefined) {
          return initialTabIndex;
        }

        return currentActiveTabIndex;
      });
    },
    [initialTabIndex]
  );

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      style={{ width: anchorEl?.clientWidth, zIndex: 1 }}
      modifiers={[
        {
          name: 'flip',
          enabled: false,
          options: {
            altBoundary: false,
          },
        },
      ]}
    >
      <Paper elevation={5} sx={{ width: '100%' }}>
        <Tabs
          sx={{ mb: 2 }}
          value={activeTabIndex ?? 0}
          onChange={(event, tabIndex) => {
            onTabChange(tabIndex);
            setActiveTabIndex(tabIndex);
          }}
        >
          <Tab label={label} />
          <Tab label="Custom" />
        </Tabs>

        <TabPanel value={activeTabIndex ?? 0} index={0}>
          <Options data={options} onOptionClick={onOptionClick} />
        </TabPanel>

        <TabPanel value={activeTabIndex ?? 0} index={1}>
          <Suggestions data={data} onSuggestionClick={onSuggestionClick} />
        </TabPanel>
      </Paper>
    </Popper>
  );
};

export default CustomOptions;
