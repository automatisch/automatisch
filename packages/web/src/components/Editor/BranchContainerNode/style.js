import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const Container = styled(Box)(({ theme, selected }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  minWidth: 300,
  height: 80,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
  },
}));

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2, 0, 2),
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
}));

export const BranchLabel = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

export const Content = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  minHeight: '40px',
  display: 'flex',
  alignItems: 'center',
}));
