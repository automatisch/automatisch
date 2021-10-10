import Avatar from '@mui/material/Avatar';

type AppIconProps = {
  name: string;
  url: string;
  color?: string;
};

export default function AppIcon(props: AppIconProps) {
  const { color, name, url } = props;

  return (
    <Avatar component="span" variant="square" sx={{ bgcolor: `#${color}` }} src={url} alt={name} />
  );
};
