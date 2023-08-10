import useConfig from 'hooks/useConfig';

const CustomLogo = () => {
  const { config, loading } = useConfig(['logo.svgData']);

  if (loading || !config?.['logo.svgData']) return null;

  const logoSvgData = config['logo.svgData'] as string;

  return (
    <img src={`data:image/svg+xml;utf8,${encodeURIComponent(logoSvgData)}`} />
  );
};

export default CustomLogo;
