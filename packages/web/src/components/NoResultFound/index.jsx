import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

import { CardContent } from './style';

function NoResultFound(props) {
  const { text, to } = props;

  const ActionAreaLink = React.useMemo(
    () =>
      React.forwardRef(function InlineLink(linkProps, ref) {
        if (!to) return <div>{linkProps.children}</div>;
        return <Link ref={ref} to={to} {...linkProps} />;
      }),
    [to],
  );

  return (
    <Card elevation={0}>
      <CardActionArea component={ActionAreaLink} {...props}>
        <CardContent>
          {!!to && <AddCircleIcon color="primary" />}
          <Typography variant="body1">{text}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

NoResultFound.propTypes = {
  text: PropTypes.string,
  to: PropTypes.string,
};

export default NoResultFound;
