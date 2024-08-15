import PropTypes from 'prop-types';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import { Box, TextField } from './style';

const noop = () => null;

function EditableTypography(props) {
  const { children, onConfirm = noop, sx, ...typographyProps } = props;
  const [editing, setEditing] = React.useState(false);
  const handleClick = React.useCallback(() => {
    setEditing((editing) => !editing);
  }, []);
  const handleTextFieldClick = React.useCallback((event) => {
    event.stopPropagation();
  }, []);
  const handleTextFieldKeyDown = React.useCallback(
    async (event) => {
      const target = event.target;
      if (event.key === 'Enter') {
        if (target.value !== children) {
          await onConfirm(target.value);
        }
        setEditing(false);
      }
    },
    [children],
  );
  const handleTextFieldBlur = React.useCallback(
    async (event) => {
      const value = event.target.value;
      if (value !== children) {
        await onConfirm(value);
      }
      setEditing(false);
    },
    [onConfirm, children],
  );
  let component = <Typography {...typographyProps}>{children}</Typography>;
  if (editing) {
    component = (
      <TextField
        onClick={handleTextFieldClick}
        onKeyDown={handleTextFieldKeyDown}
        onBlur={handleTextFieldBlur}
        variant="standard"
        autoFocus
        defaultValue={children}
      />
    );
  }
  return (
    <Box sx={sx} onClick={handleClick} editing={editing}>
      <EditIcon sx={{ mr: 1 }} />

      {component}
    </Box>
  );
}

EditableTypography.propTypes = {
  children: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
  sx: PropTypes.object,
};

export default EditableTypography;
