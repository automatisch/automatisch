import * as React from 'react';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
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
import TableFooter from '@mui/material/TableFooter';
import DeleteUserButton from 'components/DeleteUserButton/index.ee';
import ListLoader from 'components/ListLoader';
import useAdminUsers from 'hooks/useAdminUsers';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';
import TablePaginationActions from './TablePaginationActions';
import { TablePagination } from './style';

export default function UserList() {
  const formatMessage = useFormatMessage();
  const [page, setPage] = React.useState(0);
  const { data: usersData, isLoading } = useAdminUsers(page + 1);
  const users = usersData?.data;
  const { count } = usersData?.meta || {};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
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

              <TableCell component="th">
                <Typography
                  variant="subtitle1"
                  sx={{ color: 'text.secondary', fontWeight: 700 }}
                >
                  {formatMessage('userList.role')}
                </Typography>
              </TableCell>

              <TableCell component="th">
                <Typography
                  variant="subtitle1"
                  sx={{ color: 'text.secondary', fontWeight: 700 }}
                >
                  {formatMessage('userList.status')}
                </Typography>
              </TableCell>

              <TableCell component="th" />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <ListLoader
                data-test="users-list-loader"
                rowsNumber={3}
                columnsNumber={2}
              />
            )}
            {!isLoading &&
              users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  data-test="user-row"
                >
                  <TableCell scope="row">
                    <Typography variant="subtitle2" data-test="user-full-name">
                      {user.fullName}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2" data-test="user-email">
                      {user.email}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2" data-test="user-role">
                      {user.role.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2" data-test="user-status">
                      <Chip label={user.status} variant="outlined" color={user.status === 'active' ? 'success' : 'warning'} />
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" gap={1} justifyContent="right">
                      <IconButton
                        size="small"
                        component={Link}
                        to={URLS.USER(user.id)}
                        data-test="user-edit"
                      >
                        <EditIcon />
                      </IconButton>

                      <DeleteUserButton
                        data-test="user-delete"
                        userId={user.id}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {!isLoading && typeof count === 'number' && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  data-total-count={count}
                  rowsPerPageOptions={[]}
                  page={page}
                  count={count}
                  onPageChange={handleChangePage}
                  rowsPerPage={10}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </>
  );
}
