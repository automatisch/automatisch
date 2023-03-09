import { useNavigate } from 'react-router-dom';

import useAutomatischInfo from './useAutomatischInfo';

type UseCloudOptions = {
  redirect?: boolean;
}

export default function useCloud(options?: UseCloudOptions): boolean {
  const redirect = options?.redirect || false;

  const { isCloud } = useAutomatischInfo();
  const navigate = useNavigate();

  if (isCloud === false && redirect) {
    navigate('/');
  }

  return isCloud;
}
