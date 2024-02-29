import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { IconButton } from './style';

function ConditionalIconButton(props) {
  const { icon, ...buttonProps } = props;
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  if (matchSmallScreens) {
    return (
      <IconButton
        color={buttonProps.color}
        type={buttonProps.type}
        size={buttonProps.size}
        component={buttonProps.component}
        to={buttonProps.to}
        disabled={buttonProps.disabled}
        data-test={buttonProps['data-test']}
      >
        {icon}
      </IconButton>
    );
  }
  return <Button {...buttonProps} />;
}

ConditionalIconButton.propTypes = {
  icon: PropTypes.node.isRequired,
};

export default ConditionalIconButton;
