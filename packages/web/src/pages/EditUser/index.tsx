import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { IUser, IRole } from '@automatisch/types';

import { UPDATE_USER } from 'graphql/mutations/update-user.ee';
import Can from 'components/Can';
import useUser from 'hooks/useUser';
import useRoles from 'hooks/useRoles.ee';
import PageTitle from 'components/PageTitle';
import Form from 'components/Form';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';

type EditUserParams = {
  userId: string;
}

function generateRoleOptions(roles: IRole[]) {
  return roles?.map(({ name: label, id: value }) => ({ label, value }));
}

// TODO: introduce interaction feedback upon deletion (successful + failure)
// TODO: introduce loading bar
export default function EditUser(): React.ReactElement {
  const formatMessage = useFormatMessage();
  const [updateUser, { loading }] = useMutation(UPDATE_USER);
  const { userId } = useParams<EditUserParams>();
  const { user, loading: userLoading } = useUser(userId);
  const { roles, loading: rolesLoading } = useRoles();

  const handleUserUpdate = (userDataToUpdate: Partial<IUser>) => {
    updateUser({
      variables: {
        input: {
          id: userId,
          fullName: userDataToUpdate.fullName,
          email: userDataToUpdate.email,
          role: {
            id: userDataToUpdate.role?.id
          }
        }
      }
    });
  };

  if (userLoading) return <React.Fragment />;

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={9} md={8} lg={6}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('editUserPage.title')}</PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <Form defaultValues={user} onSubmit={handleUserUpdate}>
            <Stack direction="column" gap={2}>
              <TextField
                required={true}
                name="fullName"
                label={formatMessage('userForm.fullName')}
                fullWidth
              />

              <TextField
                required={true}
                name="email"
                label={formatMessage('userForm.email')}
                fullWidth
              />

              <Can I='update' a='Role'>
                <ControlledAutocomplete
                  name="role.id"
                  fullWidth
                  disablePortal
                  disableClearable={true}
                  options={generateRoleOptions(roles)}
                  renderInput={(params) => <MuiTextField {...params} label={formatMessage('userForm.role')} />}
                  loading={rolesLoading}
                />
              </Can>

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                sx={{ boxShadow: 2 }}
                loading={loading}
              >
                {formatMessage('editUser.submit')}
              </LoadingButton>
            </Stack>
          </Form>
        </Grid>
      </Grid>
    </Container>
  );
}
