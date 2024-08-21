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
