const NAMESPACE = 'automatisch';
const makeKey = (key: string) => `${NAMESPACE}.${key}`;

export const setItem = (key: string, value: string) => {
  return localStorage.setItem(makeKey(key), value);
};

export const getItem = (key: string) => {
  return localStorage.getItem(makeKey(key));
};
