import * as React from 'react';
import MuiTextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

import useDynamicFields from 'hooks/useDynamicFields';
import useDynamicData from 'hooks/useDynamicData';
import PowerInput from 'components/PowerInput';
import CodeEditor from 'components/CodeEditor';
import TextField from 'components/TextField';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import ControlledCustomAutocomplete from 'components/ControlledCustomAutocomplete';
import DynamicField from 'components/DynamicField';
import { FieldPropType } from 'propTypes/propTypes';

const optionGenerator = (options) =>
  options?.map(({ name, value }) => ({ label: name, value: value }));
function InputCreator(props) {
  const {
    onChange,
    onBlur,
    schema,
    namePrefix,
    stepId,
    disabled,
    showOptionValue,
    shouldUnregister,
  } = props;
  const {
    key: name,
    label,
    required,
    readOnly = false,
    value,
    description,
    type,
  } = schema;
  const { data, loading } = useDynamicData(stepId, schema);
  const { data: additionalFieldsData, isLoading: isDynamicFieldsLoading } =
    useDynamicFields(stepId, schema);
  const additionalFields = additionalFieldsData?.data;

  const computedName = namePrefix ? `${namePrefix}.${name}` : name;

  if (type === 'dynamic') {
    return (
      <DynamicField
        label={label}
        description={description}
        defaultValue={value}
        name={computedName}
        key={computedName}
        required={required}
        disabled={disabled}
        fields={schema.fields}
        shouldUnregister={shouldUnregister}
        stepId={stepId}
      />
    );
  }

  if (type === 'dropdown') {
    const preparedOptions = schema.options || optionGenerator(data);

    return (
      <React.Fragment>
        {!schema.variables && (
          <ControlledAutocomplete
            key={computedName}
            name={computedName}
            dependsOn={schema.dependsOn}
            fullWidth
            disablePortal
            disableClearable={required}
            options={preparedOptions}
            renderInput={(params) => (
              <MuiTextField {...params} label={label} required={required} />
            )}
            defaultValue={value}
            description={description}
            loading={loading}
            disabled={disabled}
            showOptionValue={showOptionValue}
            shouldUnregister={shouldUnregister}
            componentsProps={{ popper: { className: 'nowheel' } }}
          />
        )}

        {schema.variables && (
          <ControlledCustomAutocomplete
            key={computedName}
            name={computedName}
            dependsOn={schema.dependsOn}
            label={label}
            fullWidth
            disablePortal
            disableClearable={required}
            options={preparedOptions}
            defaultValue={value}
            description={description}
            loading={loading}
            disabled={disabled}
            showOptionValue={showOptionValue}
            shouldUnregister={shouldUnregister}
            required={required}
          />
        )}

        {isDynamicFieldsLoading && !additionalFields?.length && (
          <div>
            <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
          </div>
        )}

        {additionalFields?.map((field) => (
          <InputCreator
            key={field.key}
            schema={field}
            namePrefix="parameters"
            stepId={stepId}
            disabled={disabled}
            showOptionValue={true}
            shouldUnregister={shouldUnregister}
          />
        ))}
      </React.Fragment>
    );
  }

  if (type === 'code') {
    return (
      <React.Fragment>
        <CodeEditor
          key={computedName}
          defaultValue={value}
          required={required}
          readOnly={readOnly || disabled}
          name={computedName}
          data-test={`${computedName}-text`}
          label={label}
          fullWidth
          helperText={description}
          shouldUnregister={shouldUnregister}
          disabled={disabled}
        />
      </React.Fragment>
    );
  }

  if (type === 'string') {
    if (schema.variables) {
      return (
        <React.Fragment>
          <PowerInput
            key={computedName}
            label={label}
            description={description}
            name={computedName}
            required={required}
            disabled={disabled}
            shouldUnregister={shouldUnregister}
          />

          {isDynamicFieldsLoading && !additionalFields?.length && (
            <div>
              <CircularProgress
                sx={{ display: 'block', margin: '20px auto' }}
              />
            </div>
          )}

          {additionalFields?.map((field) => (
            <InputCreator
              key={field.key}
              schema={field}
              namePrefix="parameters"
              stepId={stepId}
              disabled={disabled}
              showOptionValue={true}
              shouldUnregister={shouldUnregister}
            />
          ))}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <TextField
          key={computedName}
          defaultValue={value}
          required={required}
          placeholder=""
          readOnly={readOnly || disabled}
          onChange={onChange}
          onBlur={onBlur}
          name={computedName}
          data-test={`${computedName}-text`}
          label={label}
          fullWidth
          helperText={description}
          clickToCopy={schema.clickToCopy}
          shouldUnregister={shouldUnregister}
          disabled={disabled}
        />

        {isDynamicFieldsLoading && !additionalFields?.length && (
          <div>
            <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
          </div>
        )}

        {additionalFields?.map((field) => (
          <InputCreator
            key={field.key}
            schema={field}
            namePrefix="parameters"
            stepId={stepId}
            disabled={disabled}
            showOptionValue={true}
            shouldUnregister={shouldUnregister}
          />
        ))}
      </React.Fragment>
    );
  }
  return <React.Fragment />;
}

InputCreator.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  schema: FieldPropType.isRequired,
  namePrefix: PropTypes.string,
  stepId: PropTypes.string,
  disabled: PropTypes.bool,
  showOptionValue: PropTypes.bool,
  shouldUnregister: PropTypes.bool,
};

export default InputCreator;
