import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import CardActionArea from '@mui/material/CardActionArea';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import useFormatMessage from 'hooks/useFormatMessage';
import { CardContent, Typography, DesktopOnlyBreakline } from './style';

type AppRowProps = {
  icon?: React.ReactNode;
  name: string;
  connectionNumber?: number;
  flowNumber?: number;
  to: string;
}

const countTranslation = (value: React.ReactNode) => (<><strong>{value}</strong><DesktopOnlyBreakline /></>);

function AppRow(props: AppRowProps) {
  const formatMessage = useFormatMessage();
  const { name, to } = props;

  return (
    <Link to={to}>
      <Card sx={{ my: 2 }}>
        <CardActionArea>
        <CardContent>
            <Box>
              <Avatar variant="square">
                {name[0].toUpperCase()}
              </Avatar>
            </Box>

            <Box>
              <Typography variant="h6">
                {name}
              </Typography>
            </Box>

            <Box sx={{ px: 2 }}>
              <Typography variant="body2">
                {formatMessage('app.connections', { count: countTranslation(Math.round(Math.random() * 100)) })}
              </Typography>
            </Box>

            <Box sx={{ px: 2 }}>
              <Typography variant="body2">
                {formatMessage('app.flows', { count: countTranslation(Math.round(Math.random() * 100)) })}
              </Typography>
            </Box>

            <Box>
              <ChevronRightIcon />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default AppRow;
