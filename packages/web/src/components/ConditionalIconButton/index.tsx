import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';

import { IconButton } from './style';

export default function ConditionalIconButton(props: any) {
  const { Icon, ...buttonProps } = props;
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  if (matchSmallScreens) {
    return (
      <IconButton
        color={buttonProps.color}
        type={buttonProps.type}
        size={buttonProps.size}
        component={buttonProps.component}
        to={buttonProps.to}
      >
        <Icon />
      </IconButton>
    )
  }

  return (
    <Button {...buttonProps} />
  );
}
