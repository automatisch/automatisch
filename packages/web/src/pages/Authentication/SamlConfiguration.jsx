import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import * as React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import ControlledAutocomplete from 'components/ControlledAutocomplete';
import Form from 'components/Form';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminCreateSamlAuthProvider from 'hooks/useAdminCreateSamlAuthProvider';
import useAdminUpdateSamlAuthProvider from 'hooks/useAdminUpdateSamlAuthProvider';
import useRoles from 'hooks/useRoles.ee';

const defaultValues = {
  active: false,
  name: '',
  certificate: '',
  signatureAlgorithm: 'sha1',
  issuer: '',
  entryPoint: '',
  firstnameAttributeName: '',
  surnameAttributeName: '',
  emailAttributeName: '',
  roleAttributeName: '',
  defaultRoleId: '',
};

const getValidationSchema = (formatMessage) => {
  const getMandatoryFieldMessage = (fieldTranslationId) =>
    formatMessage('authenticationForm.mandatoryInput', {
      inputName: formatMessage(fieldTranslationId),
    });

  return yup.object().shape({
    active: yup.boolean(),
    name: yup
      .string()
      .trim()
      .required(getMandatoryFieldMessage('authenticationForm.name')),
    certificate: yup
      .string()
      .trim()
      .required(getMandatoryFieldMessage('authenticationForm.certificate')),
    signatureAlgorithm: yup
      .string()
      .trim()
      .required(
        getMandatoryFieldMessage('authenticationForm.signatureAlgorithm'),
      ),
    issuer: yup
      .string()
      .trim()
      .required(getMandatoryFieldMessage('authenticationForm.issuer')),
    entryPoint: yup
      .string()
      .trim()
      .required(getMandatoryFieldMessage('authenticationForm.entryPoint')),
    firstnameAttributeName: yup
      .string()
      .trim()
      .required(
        getMandatoryFieldMessage('authenticationForm.firstnameAttributeName'),
      ),
    surnameAttributeName: yup
      .string()
      .trim()
      .required(
        getMandatoryFieldMessage('authenticationForm.surnameAttributeName'),
      ),
    emailAttributeName: yup
      .string()
      .trim()
      .required(
        getMandatoryFieldMessage('authenticationForm.emailAttributeName'),
      ),
    roleAttributeName: yup
      .string()
      .trim()
      .required(
        getMandatoryFieldMessage('authenticationForm.roleAttributeName'),
      ),
    defaultRoleId: yup
      .string()
      .trim()
      .required(getMandatoryFieldMessage('authenticationForm.defaultRole')),
  });
};

function generateRoleOptions(roles) {
  return roles?.map(({ name: label, id: value }) => ({ label, value }));
}

function SamlConfiguration({ provider, providerLoading }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading: isRolesLoading } = useRoles();
  const roles = data?.data;

  const {
    mutateAsync: createSamlAuthProvider,
    isPending: isCreateSamlAuthProviderPending,
    isSuccess: isCreateSamlAuthProviderSuccess,
  } = useAdminCreateSamlAuthProvider();

  const {
    mutateAsync: updateSamlAuthProvider,
    isPending: isUpdateSamlAuthProviderPending,
    isSuccess: isUpdateSamlAuthProviderSuccess,
  } = useAdminUpdateSamlAuthProvider(provider?.id);

  const isPending =
    isCreateSamlAuthProviderPending || isUpdateSamlAuthProviderPending;

  const isSuccess =
    isCreateSamlAuthProviderSuccess || isUpdateSamlAuthProviderSuccess;

  const handleSubmit = async (providerData) => {
    try {
      if (provider?.id) {
        await updateSamlAuthProvider(providerData);
      } else {
        await createSamlAuthProvider(providerData);
      }
    } catch (error) {
      const errors = error?.response?.data?.errors;
      throw errors || error;
    }
  };

  if (providerLoading) {
    return null;
  }

  return (
    <Form
      defaultValues={provider || defaultValues}
      onSubmit={handleSubmit}
      noValidate
      resolver={yupResolver(getValidationSchema(formatMessage))}
      automaticValidation={false}
      render={({ formState: { errors, isDirty } }) => (
        <Stack direction="column" gap={2}>
          <Switch
            name="active"
            label={formatMessage('authenticationForm.active')}
          />
          <TextField
            required={true}
            name="name"
            label={formatMessage('authenticationForm.name')}
            fullWidth
            error={!!errors?.name}
            helperText={errors?.name?.message}
          />
          <TextField
            required={true}
            name="certificate"
            label={formatMessage('authenticationForm.certificate')}
            fullWidth
            multiline
            error={!!errors?.certificate}
            helperText={errors?.certificate?.message}
          />
          <ControlledAutocomplete
            name="signatureAlgorithm"
            fullWidth
            disablePortal
            disableClearable={true}
            options={[
              { label: 'SHA1', value: 'sha1' },
              { label: 'SHA256', value: 'sha256' },
              { label: 'SHA512', value: 'sha512' },
            ]}
            showHelperText={false}
            renderInput={(params) => (
              <MuiTextField
                {...params}
                label={formatMessage('authenticationForm.signatureAlgorithm')}
                required
                error={!!errors?.signatureAlgorithm}
                helperText={errors?.signatureAlgorithm?.message}
              />
            )}
          />
          <TextField
            required={true}
            name="issuer"
            label={formatMessage('authenticationForm.issuer')}
            fullWidth
            error={!!errors?.issuer}
            helperText={errors?.issuer?.message}
          />
          <TextField
            required={true}
            name="entryPoint"
            label={formatMessage('authenticationForm.entryPoint')}
            fullWidth
            error={!!errors?.entryPoint}
            helperText={errors?.entryPoint?.message}
          />
          <TextField
            required={true}
            name="firstnameAttributeName"
            label={formatMessage('authenticationForm.firstnameAttributeName')}
            fullWidth
            error={!!errors?.firstnameAttributeName}
            helperText={errors?.firstnameAttributeName?.message}
          />
          <TextField
            required={true}
            name="surnameAttributeName"
            label={formatMessage('authenticationForm.surnameAttributeName')}
            fullWidth
            error={!!errors?.surnameAttributeName}
            helperText={errors?.surnameAttributeName?.message}
          />
          <TextField
            required={true}
            name="emailAttributeName"
            label={formatMessage('authenticationForm.emailAttributeName')}
            fullWidth
            error={!!errors?.emailAttributeName}
            helperText={errors?.emailAttributeName?.message}
          />
          <TextField
            required={true}
            name="roleAttributeName"
            label={formatMessage('authenticationForm.roleAttributeName')}
            fullWidth
            error={!!errors?.roleAttributeName}
            helperText={errors?.roleAttributeName?.message}
          />
          <ControlledAutocomplete
            name="defaultRoleId"
            fullWidth
            disablePortal
            disableClearable={true}
            options={generateRoleOptions(roles)}
            showHelperText={false}
            renderInput={(params) => (
              <MuiTextField
                {...params}
                label={formatMessage('authenticationForm.defaultRole')}
                required
                error={!!errors?.defaultRoleId}
                helperText={errors?.defaultRoleId?.message}
              />
            )}
            loading={isRolesLoading}
          />
          {errors?.root?.general && (
            <Alert data-test="error-alert" severity="error">
              {errors.root.general.message}
            </Alert>
          )}
          {isSuccess && !isDirty && (
            <Alert data-test="success-alert" severity="success">
              {formatMessage('authenticationForm.successfullySaved')}
            </Alert>
          )}
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            sx={{ boxShadow: 2 }}
            loading={isPending}
            disabled={!isDirty}
          >
            {formatMessage('authenticationForm.save')}
          </LoadingButton>
        </Stack>
      )}
    />
  );
}

SamlConfiguration.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    certificate: PropTypes.string,
    signatureAlgorithm: PropTypes.oneOf(['sha1', 'sha256', 'sha512']),
    issuer: PropTypes.string,
    entryPoint: PropTypes.string,
    firstnameAttributeName: PropTypes.string,
    surnameAttributeName: PropTypes.string,
    emailAttributeName: PropTypes.string,
    roleAttributeName: PropTypes.string,
    defaultRoleId: PropTypes.string,
  }),
  providerLoading: PropTypes.bool,
};

export default SamlConfiguration;
