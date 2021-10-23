import * as React from 'react';
import Avatar from '@mui/material/Avatar';

type AppIconProps = {
  name: string;
  url: string;
  color?: string;
};

const inlineImgStyle: React.CSSProperties = {
  objectFit: 'contain',
};

export default function AppIcon(props: AppIconProps) {
  const { name, url } = props;
  const color = url ? 'white' : props.color

  return (
    <Avatar
      component="span"
      variant="square"
      sx={{ bgcolor: `#${color}` }}
      imgProps={{ style: inlineImgStyle }}
      src={url}
      alt={name}
    />
  );
};
