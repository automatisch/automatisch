import useAutomatischInfo from './useAutomatischInfo';

export default function useCloud(): boolean {
  const { isCloud } = useAutomatischInfo();

  return isCloud;
}
