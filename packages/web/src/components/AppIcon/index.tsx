import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import type { AvatarProps } from '@mui/material/Avatar';

type AppIconProps = {
  name: string;
  url: string;
  color?: string;
};

const inlineImgStyle: React.CSSProperties = {
  objectFit: 'contain',
};

export default function AppIcon(props: AppIconProps & AvatarProps): React.ReactElement {
  const { name, url, color, sx = {}, ...restProps } = props;

  return (
    <Avatar
      component="span"
      variant="square"
      sx={{ bgcolor: color, display: 'flex', width: 50, height: 50, ...sx }}
      imgProps={{ style: inlineImgStyle }}
      src={url}
      alt={name}
      {...restProps}
    />
  );
};
