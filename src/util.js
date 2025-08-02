import globals from "./globals";

export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export function mod(x, n = globals.currentLength) {
  // x % n, but positive
  return (x + n) % n;
}

export function swap(arr, i, j) {
  const temp = arr[j];
  arr[j] = arr[i];
  arr[i] = temp;
}

