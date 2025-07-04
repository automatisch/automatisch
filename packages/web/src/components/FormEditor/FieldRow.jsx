import * as React from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import MuiTextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';

import TextField from 'components/TextField';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import ControlledCheckbox from 'components/ControlledCheckbox';
import useFormatMessage from 'hooks/useFormatMessage';

function FieldRow({ index, remove, control }) {
  const formatMessage = useFormatMessage();
  const fieldType = useWatch({ control, name: `fields.${index}.type` });

  const fieldTypeOptions = [
    { label: formatMessage('formEditor.fieldTypeCheckbox'), value: 'checkbox' },
    { label: formatMessage('formEditor.fieldTypeDropdown'), value: 'dropdown' },
    {
      label: formatMessage('formEditor.fieldTypeMultiline'),
      value: 'multiline',
    },
    { label: formatMessage('formEditor.fieldTypeString'), value: 'string' },
    { label: formatMessage('formEditor.fieldTypeDate'), value: 'date' },
    { label: formatMessage('formEditor.fieldTypeTime'), value: 'time' },
    { label: formatMessage('formEditor.fieldTypeDatetime'), value: 'datetime' },
  ];

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `fields.${index}.options`,
  });

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  required={true}
                  name={`fields.${index}.name`}
                  label={formatMessage('formEditor.fieldName')}
                  fullWidth
                />
                <ControlledAutocomplete
                  name={`fields.${index}.type`}
                  fullWidth
                  disablePortal
                  disableClearable={true}
                  options={fieldTypeOptions}
                  renderInput={(params) => (
                    <MuiTextField
                      {...params}
                      label={formatMessage('formEditor.fieldType')}
                      required={true}
                    />
                  )}
                />
              </Stack>

              {fieldType === 'dropdown' && (
                <Box sx={{ pl: 2, mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    {formatMessage('formEditor.dropdownOptions')}
                  </Typography>
                  <Stack spacing={2}>
                    {optionFields.map((field, optionIndex) => (
                      <Stack
                        key={field.id}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <TextField
                          name={`fields.${index}.options.${optionIndex}.value`}
                          label={formatMessage(
                            'formEditor.dropdownOptionLabel',
                            { number: optionIndex + 1 },
                          )}
                          required={true}
                          fullWidth
                        />
                        <IconButton
                          size="medium"
                          onClick={() => removeOption(optionIndex)}
                          disabled={optionFields.length === 1}
                          sx={{
                            flexShrink: 0,
                            '&:hover': {
                              backgroundColor: 'error.light',
                              color: 'error.contrastText',
                            },
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Stack>
                    ))}
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {formatMessage('formEditor.addOption')}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => appendOption({ value: '' })}
                        sx={{ width: 40, height: 40 }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              )}

              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <ControlledCheckbox
                      name={`fields.${index}.required`}
                      defaultValue={false}
                    />
                  }
                  label={formatMessage('formEditor.fieldRequired')}
                />
                <FormControlLabel
                  control={
                    <ControlledCheckbox
                      name={`fields.${index}.readonly`}
                      defaultValue={false}
                    />
                  }
                  label={formatMessage('formEditor.fieldReadonly')}
                />
              </Stack>
            </Stack>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 56, // Match the height of TextField
            }}
          >
            <IconButton
              size="small"
              onClick={() => remove(index)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText',
                },
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

FieldRow.propTypes = {
  index: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
};

export default FieldRow;
