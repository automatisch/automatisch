import copy from 'clipboard-copy';

export default function copyInputValue(element: HTMLInputElement): void {
  copy(element.value);
}
