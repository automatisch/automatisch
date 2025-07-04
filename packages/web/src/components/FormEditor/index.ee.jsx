import * as React from 'react';
import { useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import TextField from 'components/TextField';
import FieldRow from './FieldRow';
import useFormatMessage from 'hooks/useFormatMessage';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';

function FormEditor({
  control,
  isValid,
  isDirty,
  isLoading,
  translationPrefix,
}) {
  const formatMessage = useFormatMessage();
  const currentUserAbility = useCurrentUserAbility();
  const canManageFlow = currentUserAbility.can('manage', 'Flow');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const isSubmitDisabled =
    isLoading ||
    !isValid ||
    !canManageFlow ||
    (isDirty !== undefined && !isDirty);

  return (
    <Stack direction="column" gap={3} sx={{ position: 'relative' }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack gap={2}>
          <TextField
            required={true}
            name="name"
            label={formatMessage(`${translationPrefix}.name`)}
            fullWidth
          />
          <TextField
            required={true}
            name="displayName"
            label={formatMessage(`${translationPrefix}.displayName`)}
            fullWidth
          />
          <TextField
            name="description"
            label={formatMessage(`${translationPrefix}.description`)}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
          />
          <TextField
            name="submitButtonText"
            label={formatMessage(`${translationPrefix}.submitButtonText`)}
            fullWidth
          />
          <TextField
            name="responseMessage"
            label={formatMessage(`${translationPrefix}.responseMessage`)}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
          />

          <Divider sx={{ my: 1 }} />

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {formatMessage('formEditor.fields')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {formatMessage('formEditor.fieldsHelperText')}
            </Typography>

            {fields.map((field, index) => (
              <FieldRow
                key={field.id}
                index={index}
                remove={remove}
                control={control}
              />
            ))}

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {formatMessage('formEditor.addField')}
              </Typography>
              <IconButton
                size="small"
                onClick={() =>
                  append({
                    name: '',
                    type: 'string',
                    options: [{ value: '' }],
                    required: false,
                    readonly: false,
                  })
                }
                sx={{ width: 40, height: 40 }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <LoadingButton
        data-test="submit-form-editor-button"
        type="submit"
        variant="contained"
        color="primary"
        sx={{ boxShadow: 2, mt: 1 }}
        loading={isLoading}
        disabled={isSubmitDisabled}
      >
        {formatMessage(`${translationPrefix}.buttonSubmit`)}
      </LoadingButton>
    </Stack>
  );
}

FormEditor.propTypes = {
  control: PropTypes.object.isRequired,
  isValid: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  translationPrefix: PropTypes.string.isRequired,
};

export default FormEditor;
