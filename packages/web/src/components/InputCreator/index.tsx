import type { AppFields } from 'types/app';
import { useFormContext } from 'react-hook-form';

import TextField from 'components/TextField';

type InputCreatorProps = {
  onChange?: React.ChangeEventHandler;
  schema: AppFields;
};

export default function InputCreator(props: InputCreatorProps) {
  const {
    onChange,
    schema,
  } = props;

  const { control } = useFormContext();

  const {
    key: name,
    label,
    required,
    readOnly,
    value,
    description,
    clickToCopy,
  } = schema;

  return (
    <TextField
      defaultValue={value}
      required={required}
      placeholder=""
      disabled={readOnly}
      readOnly={readOnly}
      onChange={onChange}
      name={name}
      size="small"
      label={label}
      fullWidth
      helperText={description}
      control={control}
      clickToCopy={clickToCopy}
    />
  );
};
