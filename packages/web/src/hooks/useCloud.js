import { useNavigate } from 'react-router-dom';
import useAutomatischInfo from './useAutomatischInfo';
export default function useCloud(options) {
  const redirect = options?.redirect || false;
  const { isCloud } = useAutomatischInfo();
  const navigate = useNavigate();
  if (isCloud === false && redirect) {
    navigate('/');
  }
  return isCloud;
}
