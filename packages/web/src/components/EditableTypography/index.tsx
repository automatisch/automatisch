import * as React from 'react';
import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';

import { Box, TextField } from './style';

type EditableTypographyProps = TypographyProps & {
  children: string;
  onConfirm?: (value: string) => void;
};

const noop = () => null;

function EditableTypography(props: EditableTypographyProps) {
  const { children, onConfirm = noop, sx, ...typographyProps } = props;
  const [editing, setEditing] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setEditing((editing) => !editing);
  }, []);

  const handleTextFieldClick = React.useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
    },
    []
  );

  const handleTextFieldKeyDown = React.useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      if (event.key === 'Enter') {
        if (target.value !== children) {
          await onConfirm(target.value);
        }

        setEditing(false);
      }
    },
    [children]
  );

  const handleTextFieldBlur = React.useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (value !== children) {
        await onConfirm(value);
      }

      setEditing(false);
    },
    [onConfirm, children]
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

export default EditableTypography;
