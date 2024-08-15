import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
const inlineImgStyle = {
  objectFit: 'contain',
};
function AppIcon(props) {
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
      {...restProps}
    >
      {initialLetter}
    </Avatar>
  );
}

AppIcon.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.oneOfType([
    PropTypes.oneOf(['circular', 'rounded', 'square']),
    PropTypes.string,
  ]),
  sx: PropTypes.object,
};

export default AppIcon;
