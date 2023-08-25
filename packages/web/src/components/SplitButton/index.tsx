import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import * as React from 'react';
import { Link } from 'react-router-dom';

type SplitButtonProps = {
  options: {
    key: string;
    'data-test'?: string;
    label: React.ReactNode;
    to: string;
  }[];
  disabled?: boolean;
  defaultActionIndex?: number;
};

export default function SplitButton(props: SplitButtonProps) {
  const { options, disabled, defaultActionIndex = 0 } = props;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const multiOptions = options.length > 1;
  const selectedOption = options[defaultActionIndex];

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        disabled={disabled}
      >
        <Button
          size="large"
          data-test={selectedOption['data-test']}
          component={Link}
          to={selectedOption.to}
          sx={{
            // Link component causes style loss in ButtonGroup
            borderRadius: 0,
            borderRight: '1px solid #bdbdbd',
          }}
        >
          {selectedOption.label}
        </Button>

        {multiOptions && (
          <Button size="small" onClick={handleToggle} sx={{ borderRadius: 0 }}>
            <ArrowDropDownIcon />
          </Button>
        )}
      </ButtonGroup>

      {multiOptions && (
        <Popper
          sx={{
            zIndex: 1,
          }}
          open={open}
          anchorEl={anchorRef.current}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option.key}
                        selected={index === defaultActionIndex}
                        component={Link}
                        to={option.to}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}
    </React.Fragment>
  );
}
