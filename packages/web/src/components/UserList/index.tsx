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

import DeleteUserButton from 'components/DeleteUserButton/index.ee';
import useUsers from 'hooks/useUsers';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';

// TODO: introduce interaction feedback upon deletion (successful + failure)
// TODO: introduce loading bar
export default function UserList(): React.ReactElement {
  const formatMessage = useFormatMessage();
  const { users, loading } = useUsers();

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
                {formatMessage('userList.fullName')}
              </Typography>
            </TableCell>

            <TableCell component="th">
              <Typography
                variant="subtitle1"
                sx={{ color: 'text.secondary', fontWeight: 700 }}
              >
                {formatMessage('userList.email')}
              </Typography>
            </TableCell>

            <TableCell component="th" />
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell scope="row">
                <Typography
                  variant="subtitle2"
                >
                  {user.fullName}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  variant="subtitle2"
                >
                  {user.email}
                </Typography>
              </TableCell>

              <TableCell>
                <Stack direction="row" gap={1} justifyContent="right">
                  <IconButton
                    size="small"
                    component={Link}
                    to={URLS.USER(user.id)}
                  >
                    <EditIcon />
                  </IconButton>

                  <DeleteUserButton userId={user.id} />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
