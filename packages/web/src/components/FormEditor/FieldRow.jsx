import * as React from 'react';
import { useFieldArray, useWatch, useFormContext } from 'react-hook-form';
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

function ArraySubfieldConfig({ control, parentIndex, fieldIndex }) {
  const formatMessage = useFormatMessage();
  const { setValue } = useFormContext();

  const subfieldType = useWatch({
    control,
    name: `fields.${parentIndex}.fields.${fieldIndex}.type`,
  });

  const validationFormat = useWatch({
    control,
    name: `fields.${parentIndex}.fields.${fieldIndex}.validationFormat`,
  });

  const {
    fields: subfieldOptionFields,
    append: appendSubfieldOption,
    remove: removeSubfieldOption,
  } = useFieldArray({
    control,
    name: `fields.${parentIndex}.fields.${fieldIndex}.options`,
  });

  React.useEffect(
    function resetPatternAndHelperTextUponNoValidationFormat() {
      if (!validationFormat || validationFormat === '') {
        setValue(
          `fields.${parentIndex}.fields.${fieldIndex}.validationPattern`,
          '',
        );
        setValue(
          `fields.${parentIndex}.fields.${fieldIndex}.validationHelperText`,
          '',
        );
      }
    },
    [validationFormat, parentIndex, fieldIndex, setValue],
  );

  return (
    <>
      {subfieldType === 'string' && (
        <Stack spacing={2}>
          <ControlledAutocomplete
            name={`fields.${parentIndex}.fields.${fieldIndex}.validationFormat`}
            fullWidth
            disablePortal
            disableClearable={false}
            options={[
              {
                label: formatMessage('formEditor.validationFormatNone'),
                value: '',
              },
              {
                label: formatMessage('formEditor.validationFormatEmail'),
                value: 'email',
              },
              {
                label: formatMessage('formEditor.validationFormatUrl'),
                value: 'url',
              },
              {
                label: formatMessage('formEditor.validationFormatTel'),
                value: 'tel',
              },
              {
                label: formatMessage('formEditor.validationFormatNumber'),
                value: 'number',
              },
              {
                label: formatMessage('formEditor.validationFormatAlphanumeric'),
                value: 'alphanumeric',
              },
              {
                label: formatMessage('formEditor.validationFormatCustom'),
                value: 'custom',
              },
            ]}
            renderInput={(params) => (
              <MuiTextField
                {...params}
                label={formatMessage('formEditor.validationFormat')}
              />
            )}
          />

          {validationFormat === 'custom' && (
            <>
              <TextField
                name={`fields.${parentIndex}.fields.${fieldIndex}.validationPattern`}
                label={formatMessage('formEditor.validationPattern')}
                fullWidth
                helperText={formatMessage(
                  'formEditor.validationPatternHelperText',
                )}
              />
              <TextField
                name={`fields.${parentIndex}.fields.${fieldIndex}.validationHelperText`}
                label={formatMessage('formEditor.validationHelperText')}
                fullWidth
                helperText={formatMessage(
                  'formEditor.validationHelperTextDescription',
                )}
              />
            </>
          )}
        </Stack>
      )}

      {subfieldType === 'dropdown' && (
        <Box sx={{ pl: 2, mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {formatMessage('formEditor.dropdownOptions')}
          </Typography>
          <Stack spacing={2}>
            {subfieldOptionFields.map((field, optionIndex) => (
              <Stack
                key={field.id}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <TextField
                  name={`fields.${parentIndex}.fields.${fieldIndex}.options.${optionIndex}.value`}
                  label={formatMessage('formEditor.dropdownOptionLabel', {
                    number: optionIndex + 1,
                  })}
                  required={true}
                  fullWidth
                />
                <IconButton
                  size="medium"
                  onClick={() => removeSubfieldOption(optionIndex)}
                  disabled={subfieldOptionFields.length === 1}
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
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {formatMessage('formEditor.addOption')}
              </Typography>
              <IconButton
                size="small"
                onClick={() => appendSubfieldOption({ value: '' })}
                sx={{ width: 40, height: 40 }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
}

ArraySubfieldConfig.propTypes = {
  control: PropTypes.object.isRequired,
  parentIndex: PropTypes.number.isRequired,
  fieldIndex: PropTypes.number.isRequired,
};

function FieldRow({ index, remove, control }) {
  const formatMessage = useFormatMessage();
  const { setValue } = useFormContext();
  const fieldType = useWatch({ control, name: `fields.${index}.type` });
  const validationFormat = useWatch({
    control,
    name: `fields.${index}.validationFormat`,
  });
  const minItems = useWatch({
    control,
    name: `fields.${index}.minItems`,
  });
  const maxItems = useWatch({
    control,
    name: `fields.${index}.maxItems`,
  });

  const [arrayConstraintError, setArrayConstraintError] = React.useState('');

  React.useEffect(
    function validateArrayConstraints() {
      if (fieldType === 'array') {
        if (maxItems != null && maxItems < 1) {
          setArrayConstraintError(
            formatMessage('formEditor.arrayMaxItemsMinimumError'),
          );
        } else if (
          minItems != null &&
          maxItems != null &&
          maxItems < minItems
        ) {
          setArrayConstraintError(
            formatMessage('formEditor.arrayConstraintError', {
              minItems,
              maxItems,
            }),
          );
        } else {
          setArrayConstraintError('');
        }
      } else {
        setArrayConstraintError('');
      }
    },
    [fieldType, minItems, maxItems, formatMessage],
  );

  React.useEffect(
    function resetPatternAndHelperTextUponNoValidationFormat() {
      if (!validationFormat || validationFormat === '') {
        setValue(`fields.${index}.validationPattern`, '');
        setValue(`fields.${index}.validationHelperText`, '');
      }
    },
    [validationFormat, index, setValue],
  );

  React.useEffect(
    function initializeFieldsForArrayType() {
      if (fieldType === 'array') {
        const currentFields = control._formValues.fields[index].fields;
        if (!currentFields || !Array.isArray(currentFields)) {
          setValue(`fields.${index}.fields`, []);
        }
      }
    },
    [fieldType, index, setValue, control],
  );

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
    { label: formatMessage('formEditor.fieldTypeArray'), value: 'array' },
  ];

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `fields.${index}.options`,
  });

  const {
    fields: arrayFields,
    append: appendArrayField,
    remove: removeArrayField,
  } = useFieldArray({
    control,
    name: `fields.${index}.fields`,
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

              {fieldType === 'string' && (
                <Stack spacing={2}>
                  <ControlledAutocomplete
                    name={`fields.${index}.validationFormat`}
                    fullWidth
                    disablePortal
                    disableClearable={false}
                    options={[
                      {
                        label: formatMessage('formEditor.validationFormatNone'),
                        value: '',
                      },
                      {
                        label: formatMessage(
                          'formEditor.validationFormatEmail',
                        ),
                        value: 'email',
                      },
                      {
                        label: formatMessage('formEditor.validationFormatUrl'),
                        value: 'url',
                      },
                      {
                        label: formatMessage('formEditor.validationFormatTel'),
                        value: 'tel',
                      },
                      {
                        label: formatMessage(
                          'formEditor.validationFormatNumber',
                        ),
                        value: 'number',
                      },
                      {
                        label: formatMessage(
                          'formEditor.validationFormatAlphanumeric',
                        ),
                        value: 'alphanumeric',
                      },
                      {
                        label: formatMessage(
                          'formEditor.validationFormatCustom',
                        ),
                        value: 'custom',
                      },
                    ]}
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        label={formatMessage('formEditor.validationFormat')}
                      />
                    )}
                  />

                  {validationFormat === 'custom' && (
                    <>
                      <TextField
                        name={`fields.${index}.validationPattern`}
                        label={formatMessage('formEditor.validationPattern')}
                        fullWidth
                        helperText={formatMessage(
                          'formEditor.validationPatternHelperText',
                        )}
                      />
                      <TextField
                        name={`fields.${index}.validationHelperText`}
                        label={formatMessage('formEditor.validationHelperText')}
                        fullWidth
                        helperText={formatMessage(
                          'formEditor.validationHelperTextDescription',
                        )}
                      />
                    </>
                  )}
                </Stack>
              )}

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

              {fieldType === 'array' && (
                <Box sx={{ pl: 2, mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    {formatMessage('formEditor.arrayConfiguration')}
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        name={`fields.${index}.minItems`}
                        label={formatMessage('formEditor.minItems')}
                        type="number"
                        fullWidth
                        defaultValue={0}
                        inputProps={{
                          min: 0,
                          max: maxItems != null ? maxItems : undefined,
                        }}
                        error={!!arrayConstraintError}
                        helperText={arrayConstraintError || undefined}
                        onChange={(e) => {
                          const value = e.target.value;
                          setValue(
                            `fields.${index}.minItems`,
                            value === '' ? undefined : parseInt(value, 10),
                          );
                        }}
                      />
                      <TextField
                        name={`fields.${index}.maxItems`}
                        label={formatMessage('formEditor.maxItems')}
                        type="number"
                        fullWidth
                        defaultValue={1}
                        inputProps={{
                          min: minItems != null ? Math.max(1, minItems) : 1,
                        }}
                        error={!!arrayConstraintError}
                        helperText={arrayConstraintError || undefined}
                        onChange={(e) => {
                          const value = e.target.value;
                          setValue(
                            `fields.${index}.maxItems`,
                            value === '' ? undefined : parseInt(value, 10),
                          );
                        }}
                      />
                    </Stack>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                      {formatMessage('formEditor.arrayFields')}
                    </Typography>

                    {arrayFields.map((field, fieldIndex) => (
                      <Box
                        key={field.id}
                        sx={{
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                        }}
                      >
                        <Stack spacing={2}>
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                          >
                            <TextField
                              required={true}
                              name={`fields.${index}.fields.${fieldIndex}.name`}
                              label={formatMessage('formEditor.fieldName')}
                              fullWidth
                            />
                            <ControlledAutocomplete
                              name={`fields.${index}.fields.${fieldIndex}.type`}
                              fullWidth
                              disablePortal
                              disableClearable={true}
                              options={[
                                {
                                  label: formatMessage(
                                    'formEditor.fieldTypeString',
                                  ),
                                  value: 'string',
                                },
                                {
                                  label: formatMessage(
                                    'formEditor.fieldTypeCheckbox',
                                  ),
                                  value: 'checkbox',
                                },
                                {
                                  label: formatMessage(
                                    'formEditor.fieldTypeDropdown',
                                  ),
                                  value: 'dropdown',
                                },
                                {
                                  label: formatMessage(
                                    'formEditor.fieldTypeMultiline',
                                  ),
                                  value: 'multiline',
                                },
                                {
                                  label: formatMessage(
                                    'formEditor.fieldTypeDate',
                                  ),
                                  value: 'date',
                                },
                                {
                                  label: formatMessage(
                                    'formEditor.fieldTypeTime',
                                  ),
                                  value: 'time',
                                },
                                {
                                  label: formatMessage(
                                    'formEditor.fieldTypeDatetime',
                                  ),
                                  value: 'datetime',
                                },
                              ]}
                              renderInput={(params) => (
                                <MuiTextField
                                  {...params}
                                  label={formatMessage('formEditor.fieldType')}
                                  required={true}
                                />
                              )}
                            />
                          </Stack>

                          <ArraySubfieldConfig
                            control={control}
                            parentIndex={index}
                            fieldIndex={fieldIndex}
                          />

                          <Stack direction="row" spacing={2}>
                            <FormControlLabel
                              control={
                                <ControlledCheckbox
                                  name={`fields.${index}.fields.${fieldIndex}.required`}
                                  defaultValue={false}
                                />
                              }
                              label={formatMessage('formEditor.fieldRequired')}
                            />
                            <FormControlLabel
                              control={
                                <ControlledCheckbox
                                  name={`fields.${index}.fields.${fieldIndex}.readonly`}
                                  defaultValue={false}
                                />
                              }
                              label={formatMessage('formEditor.fieldReadonly')}
                            />
                          </Stack>

                          <Stack direction="row" justifyContent="flex-end">
                            <IconButton
                              size="small"
                              onClick={() => removeArrayField(fieldIndex)}
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
                          </Stack>
                        </Stack>
                      </Box>
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
                        {formatMessage('formEditor.addArrayField')}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          appendArrayField({
                            name: '',
                            type: 'string',
                          })
                        }
                        sx={{ width: 40, height: 40 }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              )}

              {fieldType !== 'array' && (
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
              )}
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
