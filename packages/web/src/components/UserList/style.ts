import { styled } from '@mui/material/styles';
import MuiTablePagination, {
  tablePaginationClasses,
} from '@mui/material/TablePagination';

export const TablePagination = styled(MuiTablePagination)(() => ({
  [`& .${tablePaginationClasses.selectLabel}, & .${tablePaginationClasses.displayedRows}`]:
    {
      fontWeight: 400,
      fontSize: 14,
    },
}));
