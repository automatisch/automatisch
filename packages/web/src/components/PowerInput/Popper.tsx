import Paper from '@mui/material/Paper';
import MuiPopper from '@mui/material/Popper';
import Tab from '@mui/material/Tab';
import * as React from 'react';

import Suggestions from 'components/PowerInput/Suggestions';
import TabPanel from 'components/TabPanel';

import { Tabs } from './style';

interface PopperProps {
  open: boolean;
  anchorEl: any;
  data: any;
  onSuggestionClick: any;
};

const Popper = (props: PopperProps) => {
  const {
    open,
    anchorEl,
    data,
    onSuggestionClick,
  } = props;

  return (
    <MuiPopper
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
          value={0}
        >
          <Tab label="Insert data..." />
        </Tabs>

        <TabPanel value={0} index={0}>
          <Suggestions
            data={data}
            onSuggestionClick={onSuggestionClick}
          />
        </TabPanel>
      </Paper>
    </MuiPopper>
  );
};


export default Popper;
