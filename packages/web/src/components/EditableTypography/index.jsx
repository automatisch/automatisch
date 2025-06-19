import PropTypes from 'prop-types';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import { Box, TextField } from './style';

const noop = () => null;

function EditableTypography(props) {
  const {
    children,
    onConfirm = noop,
    sx,
    iconColor = 'inherit',
    disabled = false,
    prefixValue = '',
    ...typographyProps
  } = props;

  const [editing, setEditing] = React.useState(false);

  const handleClick = React.useCallback(() => {
    if (disabled) return;

    setEditing((editing) => !editing);
  }, [disabled]);

  const handleTextFieldClick = React.useCallback((event) => {
    event.stopPropagation();
  }, []);

  const handleTextFieldKeyDown = React.useCallback(
    async (event) => {
      const target = event.target;
      const eventKey = event.key;

      if (eventKey === 'Enter') {
        if (target.value !== children) {
          await onConfirm(target.value);
        }

        setEditing(false);
      }

      if (eventKey === 'Escape') {
        setEditing(false);
      }
    },
    [children, onConfirm],
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

  let component = (
    <Typography {...typographyProps}>
      {prefixValue}
      {children}
    </Typography>
  );

  if (editing) {
    component = (
      <TextField
        data-test="editableTypographyInput"
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
    <Box sx={sx} onClick={handleClick} editing={editing} disabled={disabled}>
      {component}

      {!disabled && editing === false && (
        <EditIcon fontSize="small" color={iconColor} sx={{ ml: 1 }} />
      )}
    </Box>
  );
}

EditableTypography.propTypes = {
  children: PropTypes.string,
  disabled: PropTypes.bool,
  iconColor: PropTypes.oneOf(['action', 'inherit']),
  onConfirm: PropTypes.func,
  prefixValue: PropTypes.string,
  sx: PropTypes.object,
};

export default EditableTypography;
