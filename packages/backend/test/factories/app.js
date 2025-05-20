import { faker } from '@faker-js/faker';

export const createArgument = (params = {}) => {
  const labelAndKey = faker.lorem.word();

  const argument = {
    label: labelAndKey,
    key: labelAndKey,
    required: false,
    variables: true,
    ...params,
  };

  return argument;
};

export const createStringArgument = (params = {}) => {
  const stringArgument = createArgument({
    ...params,
    type: 'string',
  });

  return stringArgument;
};

export const createDropdownArgument = (params = {}) => {
  const dropdownArgument = createArgument({
    options: [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      },
    ],
    ...params,
    type: 'dropdown',
  });

  return dropdownArgument;
};

export const createDynamicArgument = (params = {}) => {
  const dynamicArgument = createArgument({
    value: [
      {
        key: '',
        value: '',
      },
    ],
    fields: [
      {
        label: 'Key',
        key: 'key',
        required: true,
        variables: true,
      },
      {
        label: 'Value',
        key: 'value',
        required: true,
        variables: true,
      },
    ],
    ...params,
    type: 'dynamic',
  });

  return dynamicArgument;
};
