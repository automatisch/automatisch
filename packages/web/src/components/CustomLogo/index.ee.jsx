import useAutomatischConfig from 'hooks/useAutomatischConfig';
import { LogoImage } from './style.ee';

const CustomLogo = () => {
  const { data: configData, isLoading } = useAutomatischConfig();
  const config = configData?.data;

  if (isLoading || !config?.logoSvgData) return null;

  const logoSvgData = config?.logoSvgData;

  return (
    <LogoImage
      data-test="custom-logo"
      src={`data:image/svg+xml;utf8,${encodeURIComponent(logoSvgData)}`}
    />
  );
};

export default CustomLogo;
