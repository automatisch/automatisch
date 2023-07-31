import {
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ControlledCheckbox from 'components/ControlledCheckbox';

const PermissionCatalogFieldLoader = () => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component="th" />
            {[...Array(5)].map((row, index) => (
              <TableCell key={index} component="th">
                <Skeleton />
              </TableCell>
            ))}
            <TableCell component="th" />
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(3)].map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
              <TableCell scope="row">
                <Skeleton width={40} />
              </TableCell>

              {[...Array(5)].map((action, index) => (
                <TableCell key={index} align="center">
                  <Typography variant="subtitle2">
                    <ControlledCheckbox name="value" />
                  </Typography>
                </TableCell>
              ))}

              <TableCell>
                <Stack direction="row" gap={1} justifyContent="right">
                  <IconButton color="info" size="small">
                    <SettingsIcon />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PermissionCatalogFieldLoader;
