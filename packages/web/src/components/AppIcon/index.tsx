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

export default function AppIcon(props: AppIconProps & AvatarProps) {
  const { name, url, sx = {}, ...restProps } = props;
  const color = url ? 'white' : props.color

  return (
    <Avatar
      component="span"
      variant="square"
      sx={{ bgcolor: `#${color}`, display: 'inline-flex', width: 50, height: 50, ...sx }}
      imgProps={{ style: inlineImgStyle }}
      src={url}
      alt={name}
      {...restProps}
    />
  );
};
