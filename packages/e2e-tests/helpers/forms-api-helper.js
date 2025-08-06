import { expect } from '../fixtures/index';

export const createForm = async (request, token, formName) => {
  const response = await request.post(
    `${process.env.BACKEND_APP_URL}/internal/api/v1/forms`,
    {
      headers: { Authorization: token },
      data: {
        fields: [
          {
            name: 'abc',
            type: 'string',
            options: [{ value: '' }],
            required: false,
            readonly: false,
            validationPattern: '',
            validationHelperText: '',
            fields: [],
            key: 'abc',
          },
        ],
        name: formName,
        displayName: 'abc',
        description: '',
        submitButtonText: '',
        responseMessage: '',
      },
    }
  );
  expect(response.status()).toBe(201);

  return await response.json();
};
