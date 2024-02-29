import copy from 'clipboard-copy';
export default function copyInputValue(element) {
  copy(element.value);
}
