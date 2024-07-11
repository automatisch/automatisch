import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tab from '@mui/material/Tab';
import * as React from 'react';
import Suggestions from 'components/PowerInput/Suggestions';
import TabPanel from 'components/TabPanel';
import { FieldDropdownOptionPropType } from 'propTypes/propTypes';
import Options from './Options';
import { Tabs } from './style';

const CustomOptions = (props) => {
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
  const [activeTabIndex, setActiveTabIndex] = React.useState(undefined);
  React.useEffect(
    function applyInitialActiveTabIndex() {
      setActiveTabIndex((currentActiveTabIndex) => {
        if (currentActiveTabIndex === undefined) {
          return initialTabIndex;
        }
        return currentActiveTabIndex;
      });
    },
    [initialTabIndex],
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
      className="nowheel"
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

CustomOptions.propTypes = {
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      output: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
  ).isRequired,
  options: PropTypes.arrayOf(FieldDropdownOptionPropType).isRequired,
  onSuggestionClick: PropTypes.func.isRequired,
  onOptionClick: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  initialTabIndex: PropTypes.oneOf([0, 1]),
};

export default CustomOptions;
