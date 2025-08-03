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

export const randEl = (array, rand = Math.random) => {
  const i = randInt(0, array.length - 1, rand)
  return array[i];
}

export const randInt = (min, max, rand = Math.random) => {
  const range = max - min + 1;
  return Math.floor(min + rand() * range);
}

