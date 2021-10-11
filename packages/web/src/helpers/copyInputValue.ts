import copy from 'clipboard-copy';
export default function copyInputValue(element: HTMLInputElement) {
  copy(element.value);
};
