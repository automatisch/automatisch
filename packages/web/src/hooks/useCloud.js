import { useNavigate } from 'react-router-dom';

import useAutomatischInfo from './useAutomatischInfo';

export default function useCloud(options) {
  const redirect = options?.redirect || false;
  const navigate = useNavigate();
  const { data: automatischInfo } = useAutomatischInfo();

  const isCloud = automatischInfo?.data.isCloud;

  if (isCloud === false && redirect) {
    navigate('/');
  }

  return isCloud;
}
