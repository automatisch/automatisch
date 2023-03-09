import * as React from 'react';
import { DateTime } from 'luxon';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import useUsageData from 'hooks/useUsageData.ee';

export default function UsageDataInformation() {
  const usageData = useUsageData();

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="td" scope="row">
                Current plan
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 500 }}>{usageData.name}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="td" scope="row">
                Total allowed task count
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 500 }}>{usageData.allowedTaskCount}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="td" scope="row">
                Consumed task count
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 500 }}>{usageData.consumedTaskCount}</TableCell>
            </TableRow>

            <TableRow sx={{ 'td': { border: 0 } }}>
              <TableCell component="td" scope="row">
                Next billing date
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 500 }}>{usageData.nextResetAt?.toLocaleString(DateTime.DATE_FULL)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
