const NAMESPACE = 'automatisch';
const makeKey = (key) => `${NAMESPACE}.${key}`;

export const setItem = (key, value) => {
  return localStorage.setItem(makeKey(key), value);
};

export const getItem = (key) => {
  return localStorage.getItem(makeKey(key));
};

export const removeItem = (key) => {
  return localStorage.removeItem(makeKey(key));
};
