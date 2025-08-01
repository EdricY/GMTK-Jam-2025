import { $ } from "./util";

const container = $("#hangman");

export function setupHangman(length) {
  const hgword1 = createHangmanWord(length);
  container.append(hgword1)

  const hgword2 = createHangmanWord(length);
  container.append(hgword2)
}

export function createHangmanWord(length) {
  const wordEl = document.createElement("div");
  wordEl.classList.add("hangman-word");
  for (let i = 0; i < length; i++) {
    const segEl = createHangmanSegment()
    wordEl.appendChild(segEl);
  }

  return wordEl;
}

export function createHangmanSegment() {
  const segEl = document.createElement("span");
  segEl.classList.add("hangman-seg");
  segEl.innerHTML = "&nbsp;"

  return segEl;
}

export function fillHangmanSegment(i, ch) {
  const r = Math.floor(i / currentLength);
  const c = i % currentLength;

  if (r >= container.children.length) return;
  if (c >= container.children[r].children.length) return;
  container.children[r].children[c].innerText = ch;
}

export function removeHangmanSegment(i) {
  fillHangmanSegment(i, "")
}
