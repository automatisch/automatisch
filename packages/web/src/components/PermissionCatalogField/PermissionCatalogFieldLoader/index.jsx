import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import ControlledCheckbox from 'components/ControlledCheckbox';

const PermissionCatalogFieldLoader = () => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component="th" />
            {[...Array(4)].map((row, index) => (
              <TableCell key={index} component="th">
                <Skeleton />
              </TableCell>
            ))}
            <TableCell component="th" />
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(3)].map((row, subjectIndex) => (
            <TableRow
              key={subjectIndex}
              sx={{ '&:last-child td': { border: 0 } }}
            >
              <TableCell scope="row">
                <Skeleton width={40} />
              </TableCell>

              {[...Array(4)].map(
                (action, actionIndex) =>
                  (subjectIndex !== 2 ||
                    (actionIndex !== 3 && actionIndex !== 2)) && (
                    <TableCell key={actionIndex} align="center">
                      <Typography variant="subtitle2">
                        <ControlledCheckbox name="value" disabled />
                      </Typography>
                    </TableCell>
                  ),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PermissionCatalogFieldLoader;
