import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

export const generateInternalLink = (link) =>
  function LinkVariable(str) {
    return (
      <Link component={RouterLink} to={link}>
        {str}
      </Link>
    );
  };

export const generateExternalLink = (link) =>
  function LinkVariable(str) {
    return (
      <Link href={link} target="_blank">
        {str}
      </Link>
    );
  };

export const makeBold = (str) => <strong>{str}</strong>;
