import React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { Button } from './style';

const BG_IMAGE_FALLBACK =
  'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%) /*! @noflip */';

export type ColorButtonProps = Omit<ButtonProps, 'children'> & {
  bgColor: string;
  isBgColorValid: boolean;
  disablePopover: boolean;
};

export type ColorButtonElement = (props: ColorButtonProps) => JSX.Element;

const ColorButton = (props: ColorButtonProps) => {
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

export default ColorButton;
