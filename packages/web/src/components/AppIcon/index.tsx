import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import type { AvatarProps } from '@mui/material/Avatar';

type AppIconProps = {
  name?: string;
  url?: string;
  color?: string;
  variant?: AvatarProps['variant'];
};

const inlineImgStyle: React.CSSProperties = {
  objectFit: 'contain',
};

export default function AppIcon(
  props: AppIconProps & AvatarProps
): React.ReactElement {
  const { name, url, color, sx = {}, variant = 'square', ...restProps } = props;

  const initialLetter = name?.[0];

  return (
    <Avatar
      component="span"
      variant={variant}
      sx={{ bgcolor: color, display: 'flex', width: 50, height: 50, ...sx }}
      imgProps={{ style: inlineImgStyle }}
      src={url}
      alt={name}
      children={initialLetter}
      {...restProps}
    />
  );
}
