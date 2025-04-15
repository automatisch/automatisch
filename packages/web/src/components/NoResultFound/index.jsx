import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

import { CardContent } from './style';

function NoResultFound(props) {
  const { onClick, text, to } = props;

  const ActionAreaLink = React.useMemo(
    () =>
      React.forwardRef(function InlineLink(linkProps, ref) {
        if (to) return <Link ref={ref} to={to} {...linkProps} />;

        if (onClick) return <Button onClick={onClick} {...linkProps} />;

        return <div>{linkProps.children}</div>;
      }),
    [to, onClick],
  );

  return (
    <Card elevation={0} data-test="no-results">
      <CardActionArea component={ActionAreaLink} {...props}>
        <CardContent>
          {(!!to || !!onClick) && <AddCircleIcon color="primary" />}
          <Typography variant="body1">{text}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

NoResultFound.propTypes = {
  text: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

export default NoResultFound;
