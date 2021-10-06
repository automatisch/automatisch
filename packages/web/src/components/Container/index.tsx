import MuiContainer, { ContainerProps } from '@mui/material/Container';

export default function Container(props: ContainerProps) {
  return (
    <MuiContainer {...props} />
  );
};

Container.defaultProps = {
  maxWidth: 'lg'
};
