import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

export const generateInternalLink = (link) => (str) => (
  <Link component={RouterLink} to={link}>
    {str}
  </Link>
);

export const generateExternalLink = (link) => (str) => (
  <Link href={link} target="_blank">
    {str}
  </Link>
);
