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
    iconPosition = 'start',
    iconSize = 'large',
    sx,
    disabledEditing = false,
    prefixValue = '',
    ...typographyProps
  } = props;

  const [editing, setEditing] = React.useState(false);

  const handleClick = React.useCallback(() => {
    if (disabledEditing) return;

    setEditing((editing) => !editing);
  }, [disabledEditing]);

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

      if (event.key === 'Escape') {
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
    <Box
      sx={sx}
      onClick={handleClick}
      editing={editing}
      disabledEditing={disabledEditing}
    >
      {iconPosition === 'start' && editing === false && (
        <EditIcon fontSize={iconSize} sx={{ mr: 1 }} />
      )}

      {component}

      {iconPosition === 'end' && editing === false && (
        <EditIcon fontSize={iconSize} sx={{ ml: 1 }} />
      )}
    </Box>
  );
}

EditableTypography.propTypes = {
  children: PropTypes.string.isRequired,
  disabledEditing: PropTypes.bool,
  iconPosition: PropTypes.oneOf(['start', 'end']),
  iconSize: PropTypes.oneOf(['small', 'large']),
  onConfirm: PropTypes.func,
  prefixValue: PropTypes.string,
  sx: PropTypes.object,
};

export default EditableTypography;
