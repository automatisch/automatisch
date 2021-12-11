import { useMemo, forwardRef } from 'react';
import { useMatch } from 'react-router-dom';
import ListItem from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, LinkProps } from 'react-router-dom';

type ListItemLinkProps = {
  icon: React.ReactNode;
  primary: string;
  to: string;
}

export default function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props;
  const selected = useMatch({ path: to, end: false });

  const CustomLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(function InLineLink(
        linkProps,
        ref,
      ) {
        return <Link ref={ref} to={to} {...linkProps} />;
      }),
    [to],
  );

  return (
    <li>
      <ListItem component={CustomLink} sx={{ pl: { xs: 2, sm: 3 } }} selected={!!selected}>
        <ListItemIcon sx={{ minWidth: 52 }}>{icon}</ListItemIcon>
        <ListItemText primary={primary} primaryTypographyProps={{ variant: 'body1', }} />
      </ListItem>
    </li>
  );
};
