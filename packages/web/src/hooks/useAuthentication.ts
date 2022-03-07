import { getItem } from 'helpers/storage';

export default function useAuthentication(): boolean {
  const token = getItem('token');

  return Boolean(token);
}
