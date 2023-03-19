import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LockIcon from '@mui/icons-material/Lock';

const rows = [
  { tasks: '10,000', price: '€20 / month', selected: true },
  { tasks: '30,000', price: '€50 / month', selected: false },
];

export default function UpgradeFreeTrial() {
  return (
    <React.Fragment>
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              Upgrade your free trial
            </Typography>
            {/* <Chip label="Active" color="success" /> */}
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid
            container
            item
            xs={12}
            spacing={1}
            sx={{ mb: 2 }}
            alignItems="stretch"
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ pt: 0, pb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: 'text.secondary', mt: 2, fontWeight: 500 }}
                      >
                        Monthly Tasks
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 0, pb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: 'text.secondary', mt: 2, fontWeight: 500 }}
                      >
                        Price
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.tasks}
                      sx={{
                        backgroundColor: row.selected ? '#f1f3fa' : 'white',
                        border: row.selected ? '2px solid #0059f7' : 'none',
                      }}
                    >
                      <TableCell component="th" scope="row" sx={{ py: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: row.selected ? 'bold' : 'normal',
                          }}
                        >
                          {row.tasks}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: row.selected ? 'bold' : 'normal',
                          }}
                        >
                          {row.price}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mt: 2,
                }}
              >
                Due today:&nbsp;
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  mt: 2,
                  fontWeight: 'bold',
                }}
              >
                €20
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ fontSize: '12px', mt: 0 }}>
              + VAT if applicable
            </Typography>
            <Button size="small" variant="contained" sx={{ mt: 2 }}>
              <LockIcon fontSize="small" sx={{ mr: 1 }} />
              Pay securely via Paddle
            </Button>
          </Box>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
