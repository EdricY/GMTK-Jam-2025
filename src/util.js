
export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export function mod(x, n) {
  // x % n, but positive
  return (x + n) % n;
}


