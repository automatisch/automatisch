import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

type AppRowProps = {
  icon?: React.ReactNode;
  name: string;
  connectionNumber?: number;
  flowNumber?: number;
}

export default function AppRow(props: AppRowProps) {
  const { name } = props;

  return (
    <Card sx={{ my: 1 }}>
      <CardActionArea>

       <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
