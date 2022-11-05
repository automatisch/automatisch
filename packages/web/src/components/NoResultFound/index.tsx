import * as React from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import Card from '@mui/material/Card';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import { CardContent } from './style';

type NoResultFoundProps = {
  text?: string;
  to?: string;
};

export default function NoResultFound(
  props: NoResultFoundProps
): React.ReactElement {
  const { text, to } = props;

  const ActionAreaLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(
        function InlineLink(linkProps, ref) {
          if (!to) return <div>{linkProps.children}</div>;

          return <Link ref={ref} to={to} {...linkProps} />;
        }
      ),
    [to]
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
