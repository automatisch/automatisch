import * as React from 'react';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';

import DeleteRoleButton from 'components/DeleteRoleButton/index.ee';
import ListLoader from 'components/ListLoader';
import useFormatMessage from 'hooks/useFormatMessage';
import useRoles from 'hooks/useRoles.ee';
import * as URLS from 'config/urls';

export default function RoleList(): React.ReactElement {
  const formatMessage = useFormatMessage();
  const { roles, loading } = useRoles();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component="th">
              <Typography
                variant="subtitle1"
                sx={{ color: 'text.secondary', fontWeight: 700 }}
              >
                {formatMessage('roleList.name')}
              </Typography>
            </TableCell>

            <TableCell component="th">
              <Typography
                variant="subtitle1"
                sx={{ color: 'text.secondary', fontWeight: 700 }}
              >
                {formatMessage('roleList.description')}
              </Typography>
            </TableCell>

            <TableCell component="th" />
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && <ListLoader
            rowsNumber={3}
            columnsNumber={2}
            data-test="roles-list-loader" />}
          {!loading &&
            roles.map((role) => (
              <TableRow
                key={role.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                data-test="role-row"
              >
                <TableCell scope="row">
                  <Typography
                    variant="subtitle2"
                    data-test="role-name"
                  >{role.name}</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography
                    variant="subtitle2"
                    data-test="role-description"
                  >{role.description}</Typography>
                </TableCell>

                <TableCell>
                  <Stack direction="row" gap={1} justifyContent="right">
                    <IconButton
                      size="small"
                      component={Link}
                      to={URLS.ROLE(role.id)}
                      data-test="role-edit"
                    >
                      <EditIcon />
                    </IconButton>

                    <DeleteRoleButton
                      disabled={role.isAdmin}
                      roleId={role.id}
                      data-test="role-delete"
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
