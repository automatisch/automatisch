import * as React from 'react';
import { DateTime } from 'luxon';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import useUsageData from 'hooks/useUsageData.ee';

export default function UsageDataInformation() {
  const usageData = useUsageData();

  return (
    <React.Fragment>
      <Card sx={{ minWidth: 275, mb: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              Subscription plan
            </Typography>
            {/* <Chip label="Active" color="success" /> */}
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={4} sx={{ mb: [2, 5] }}>
              <Card
                sx={{
                  mb: 3,
                  backgroundColor: '#fafafa',
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" sx={{ pb: 0.5 }}>
                    Monthly quota
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    Free trial
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Upgrade plan</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={4} sx={{ mb: [2, 5] }}>
              <Card
                sx={{
                  mb: 3,
                  backgroundColor: '#fafafa',
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" sx={{ pb: 0.5 }}>
                    Next bill amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ---
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* <Button size="small">Update billing info</Button> */}
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={4} sx={{ mb: [2, 5] }}>
              <Card
                sx={{
                  mb: 3,
                  backgroundColor: '#fafafa',
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" sx={{ pb: 0.5 }}>
                    Next bill date
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ---
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* <Button disabled size="small">
                    monthly billing
                  </Button> */}
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Your usage
            </Typography>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', mt: 1 }}
              >
                Last 30 days total usage
              </Typography>
            </Box>
            <Divider sx={{ mt: 2 }} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', mt: 2, fontWeight: 500 }}
              >
                Tasks
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', mt: 2, fontWeight: 500 }}
              >
                12300
              </Typography>
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>
          <Button size="small" variant="contained" sx={{ mt: 2 }}>
            Upgrade
          </Button>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
