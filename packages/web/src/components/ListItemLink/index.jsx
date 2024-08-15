import * as React from 'react';
import { useMatch } from 'react-router-dom';
import ListItem from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function ListItemLink(props) {
  const { icon, primary, to, onClick, 'data-test': dataTest, target } = props;
  const selected = useMatch({ path: to, end: true });

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef(function InLineLink(linkProps, ref) {
        try {
          // challenge the link to check if it's absolute URL
          new URL(to); // should throw an error if it's not an absolute URL
          return (
            <a
              {...linkProps}
              ref={ref}
              href={to}
              target={target}
              rel="noopener noreferrer"
            />
          );
        } catch {
          return <Link ref={ref} {...linkProps} to={to} />;
        }
      }),
    [to],
  );

  return (
    <li>
      <ListItem
        component={CustomLink}
        sx={{ pl: { xs: 2, sm: 3 } }}
        selected={!!selected}
        onClick={onClick}
        data-test={dataTest}
        target={target}
      >
        <ListItemIcon sx={{ minWidth: 52 }}>{icon}</ListItemIcon>
        <ListItemText
          primary={primary}
          primaryTypographyProps={{ variant: 'body1' }}
        />
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.node.isRequired,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  target: PropTypes.oneOf(['_blank']),
  onClick: PropTypes.func,
  'data-test': PropTypes.string,
};

export default ListItemLink;
