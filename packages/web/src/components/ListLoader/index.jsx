import PropTypes from 'prop-types';
import {
  IconButton,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ListLoader = ({ rowsNumber, columnsNumber, 'data-test': dataTest }) => {
  return (
    <>
      {[...Array(rowsNumber)].map((row, index) => (
        <TableRow
          key={index}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          data-test={dataTest && index === 0 ? dataTest : undefined}
        >
          {[...Array(columnsNumber)].map((cell, index) => (
            <TableCell key={index} scope="row">
              <Skeleton />
            </TableCell>
          ))}

          <TableCell>
            <Stack direction="row" gap={1} justifyContent="right">
              <IconButton size="small">
                <EditIcon />
              </IconButton>

              <IconButton size="small">
                <DeleteIcon />
              </IconButton>
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

ListLoader.propTypes = {
  rowsNumber: PropTypes.number.isRequired,
  columnsNumber: PropTypes.number.isRequired,
  'data-test': PropTypes.string,
};

export default ListLoader;
