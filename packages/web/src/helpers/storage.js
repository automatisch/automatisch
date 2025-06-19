const NAMESPACE = 'automatisch';
const makeKey = (key) => `${NAMESPACE}.${key}`;

export const setItem = (key, value) => {
  return window.localStorage.setItem(makeKey(key), value);
};

export const getItem = (key) => {
  return window.localStorage.getItem(makeKey(key));
};

export const removeItem = (key) => {
  return window.localStorage.removeItem(makeKey(key));
};
