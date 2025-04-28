import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function FileUploadInput(props) {
  const { onChange, children, ...rest } = props;
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<AttachFileIcon />}
      {...rest}
    >
      {children}

      <VisuallyHiddenInput type="file" onChange={onChange} />
    </Button>
  );
}

FileUploadInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
