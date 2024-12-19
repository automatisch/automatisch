import * as React from 'react';
import PropTypes from 'prop-types';
import MuiContainer from '@mui/material/Container';

export default function Container({ maxWidth = 'lg', ...props }) {
  return <MuiContainer maxWidth={maxWidth} {...props} />;
}

Container.propTypes = {
  maxWidth: PropTypes.oneOf([
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    false,
    PropTypes.string,
  ]),
};
