import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { DateTime } from 'luxon';
import * as React from 'react';

import ListLoader from 'components/ListLoader';
import useFormatMessage from 'hooks/useFormatMessage';
import DeleteApiTokenButton from 'components/DeleteApiTokenButton/index.ee';

export default function ApiTokenList({ loading, apiTokens }) {
  const formatMessage = useFormatMessage();

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
                  {formatMessage('adminApiTokenList.token')}
                </Typography>
              </TableCell>

              <TableCell component="th">
                <Typography
                  variant="subtitle1"
                  sx={{ color: 'text.secondary', fontWeight: 700 }}
                >
                  {formatMessage('adminApiTokenList.createdAt')}
                </Typography>
              </TableCell>

              <TableCell component="th" />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <ListLoader
                data-test="apiTokens-list-loader"
                rowsNumber={3}
                columnsNumber={3}
              />
            )}
            {!loading &&
              apiTokens.map((apiToken) => (
                <TableRow
                  key={apiToken.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  data-test="api-token-row"
                >
                  <TableCell scope="row">
                    <Typography variant="subtitle2" data-test="api-token-token">
                      {apiToken.token}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      data-test="api-token-created-at"
                    >
                      {DateTime.fromMillis(
                        parseInt(apiToken.createdAt, 10),
                      ).toLocaleString(DateTime.DATETIME_MED)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" gap={1} justifyContent="right">
                      <DeleteApiTokenButton
                        data-test="api-token-delete"
                        apiTokenId={apiToken.id}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

ApiTokenList.propTypes = {
  apiTokens: PropTypes.array,
  loading: PropTypes.bool,
};
