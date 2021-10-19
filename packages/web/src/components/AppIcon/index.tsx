import Avatar from '@mui/material/Avatar';

type AppIconProps = {
  name: string;
  url: string;
  color?: string;
};

export default function AppIcon(props: AppIconProps) {
  const { name, url } = props;
  const color = url ? 'white' : props.color
  
  return (
    <Avatar component="span" variant="square" sx={{ bgcolor: `#${color}` }} src={url} alt={name} />
  );
};
