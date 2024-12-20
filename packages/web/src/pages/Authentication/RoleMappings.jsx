import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Form from 'components/Form';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminSamlAuthProviderRoleMappings from 'hooks/useAdminSamlAuthProviderRoleMappings';
import useAdminUpdateSamlAuthProviderRoleMappings from 'hooks/useAdminUpdateSamlAuthProviderRoleMappings';
import RoleMappingsFieldArray from './RoleMappingsFieldsArray';

function generateFormRoleMappings(roleMappings) {
  if (roleMappings?.length === 0) {
    return [{ roleId: '', remoteRoleName: '' }];
  }

  return roleMappings?.map(({ roleId, remoteRoleName }) => ({
    roleId,
    remoteRoleName,
  }));
}

const uniqueRemoteRoleName = (array, context, formatMessage) => {
  const seen = new Set();
  for (const [index, value] of array.entries()) {
    if (seen.has(value.remoteRoleName)) {
      const path = `${context.path}[${index}].remoteRoleName`;
      return context.createError({
        message: `${formatMessage('roleMappingsForm.remoteRoleName')} must be unique`,
        path,
      });
    }
    seen.add(value.remoteRoleName);
  }
  return true;
};

const getValidationSchema = (formatMessage) =>
  yup.object({
    roleMappings: yup
      .array()
      .of(
        yup.object({
          roleId: yup
            .string()
            .required(`${formatMessage('roleMappingsForm.role')} is required`),
          remoteRoleName: yup
            .string()
            .required(
              `${formatMessage('roleMappingsForm.remoteRoleName')} is required`,
            ),
        }),
      )
      .test('unique-remoteRoleName', '', (value, ctx) => {
        return uniqueRemoteRoleName(value, ctx, formatMessage);
      }),
  });

function RoleMappings({ provider, providerLoading }) {
  const formatMessage = useFormatMessage();

  const {
    mutateAsync: updateRoleMappings,
    isPending: isUpdateRoleMappingsPending,
    isSuccess: isUpdateRoleMappingsSuccess,
  } = useAdminUpdateSamlAuthProviderRoleMappings(provider?.id);

  const { data, isLoading: isAdminSamlAuthProviderRoleMappingsLoading } =
    useAdminSamlAuthProviderRoleMappings({
      adminSamlAuthProviderId: provider?.id,
    });
  const roleMappings = data?.data;
  const fieldNames = ['remoteRoleName', 'roleId'];
  const [fieldErrors, setFieldErrors] = useState(null);

  const handleRoleMappingsUpdate = async (values) => {
    try {
      setFieldErrors(null);
      if (provider?.id) {
        await updateRoleMappings(
          values.roleMappings.map(({ roleId, remoteRoleName }) => ({
            roleId,
            remoteRoleName,
          })),
        );
      }
    } catch (error) {
      const errors = error?.response?.data?.errors;
      if (errors) {
        Object.entries(errors).forEach(([fieldName, fieldErrors]) => {
          if (fieldNames.includes(fieldName) && Array.isArray(fieldErrors)) {
            setFieldErrors((prevErrors) => [
              ...(prevErrors || []),
              `${fieldName}: ${fieldErrors.join(', ')}`,
            ]);
          }
        });
      }
      throw errors || error;
    }
  };

  const defaultValues = useMemo(
    () => ({
      roleMappings: generateFormRoleMappings(roleMappings),
    }),
    [roleMappings],
  );

  const renderErrors = (errors) => {
    const generalError = errors?.root?.general?.message;
    if (fieldErrors) {
      return fieldErrors.map((error, index) => (
        <Alert key={index} data-test="error-alert" severity="error">
          {error}
        </Alert>
      ));
    }

    if (generalError) {
      return (
        <Alert data-test="error-alert" severity="error">
          {generalError}
        </Alert>
      );
    }
  };

  if (
    providerLoading ||
    !provider?.id ||
    isAdminSamlAuthProviderRoleMappingsLoading
  ) {
    return null;
  }

  return (
    <>
      <Divider sx={{ pt: 2 }} />
      <Typography variant="h3">
        {formatMessage('roleMappingsForm.title')}
      </Typography>
      <Form
        defaultValues={defaultValues}
        onSubmit={handleRoleMappingsUpdate}
        resolver={yupResolver(getValidationSchema(formatMessage))}
        mode="onSubmit"
        reValidateMode="onChange"
        noValidate
        automaticValidation={false}
        render={({ formState: { errors, isDirty } }) => (
          <Stack direction="column" spacing={2}>
            <RoleMappingsFieldArray />
            {renderErrors(errors)}
            {isUpdateRoleMappingsSuccess && !isDirty && (
              <Alert data-test="success-alert" severity="success">
                {formatMessage('roleMappingsForm.successfullySaved')}
              </Alert>
            )}
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2 }}
              loading={isUpdateRoleMappingsPending}
              disabled={!isDirty}
            >
              {formatMessage('roleMappingsForm.save')}
            </LoadingButton>
          </Stack>
        )}
      />
    </>
  );
}

RoleMappings.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  providerLoading: PropTypes.bool,
};

export default RoleMappings;
