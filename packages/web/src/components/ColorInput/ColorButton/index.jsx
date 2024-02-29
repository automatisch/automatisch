import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './style';

const BG_IMAGE_FALLBACK =
  'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%) /*! @noflip */';

const ColorButton = (props) => {
  const {
    bgColor,
    className,
    disablePopover,
    isBgColorValid,
    ...restButtonProps
  } = props;
  return (
    <Button
      data-test="color-button"
      disableTouchRipple
      style={{
        backgroundColor: isBgColorValid ? bgColor : undefined,
        backgroundImage: isBgColorValid ? undefined : BG_IMAGE_FALLBACK,
        cursor: disablePopover ? 'default' : undefined,
      }}
      className={`MuiColorInput-Button ${className || ''}`}
      {...restButtonProps}
    />
  );
};

ColorButton.propTypes = {
  bgColor: PropTypes.string.isRequired,
  className: PropTypes.string,
  disablePopover: PropTypes.bool.isRequired,
  isBgColorValid: PropTypes.bool.isRequired,
};

export default ColorButton;
