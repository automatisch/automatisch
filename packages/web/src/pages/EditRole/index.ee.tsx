import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { IRole } from '@automatisch/types';

import { UPDATE_ROLE } from 'graphql/mutations/update-role.ee';
import useRole from 'hooks/useRole.ee';
import PageTitle from 'components/PageTitle';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';
import { Skeleton } from '@mui/material';

type EditRoleParams = {
  roleId: string;
};

// TODO: introduce interaction feedback upon deletion (successful + failure)
export default function EditRole(): React.ReactElement {
  const formatMessage = useFormatMessage();
  const [updateRole, { loading }] = useMutation(UPDATE_ROLE);
  const { roleId } = useParams<EditRoleParams>();
  const { role, loading: roleLoading } = useRole(roleId);

  const handleRoleUpdate = (roleData: Partial<IRole>) => {
    updateRole({
      variables: {
        input: {
          id: roleId,
          name: roleData.name,
          description: roleData.description,
        },
      },
    });
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={9} md={8} lg={6}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('editRolePage.title')}</PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          {roleLoading ? (
            <Stack direction="column" gap={2}>
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={45} />
            </Stack>
          ) : (
            <Form defaultValues={role} onSubmit={handleRoleUpdate}>
              <Stack direction="column" gap={2}>
                <TextField
                  required={true}
                  name="name"
                  label={formatMessage('roleForm.name')}
                  fullWidth
                />

                <TextField
                  required={true}
                  name="description"
                  label={formatMessage('roleForm.description')}
                  fullWidth
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2 }}
                  loading={loading}
                >
                  {formatMessage('editRole.submit')}
                </LoadingButton>
              </Stack>
            </Form>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
