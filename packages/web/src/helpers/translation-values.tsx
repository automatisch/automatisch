import Link from '@mui/material/Link';

export const generateExternalLink = (link: string) => (str: string) =>
  (
    <Link href={link} target="_blank">
      {str}
    </Link>
  );
