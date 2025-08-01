import { $ } from "./util";

const container = $("#hangman");

const hangmanSegments = [];

export function setupHangman(level) {
  hangmanSegments.splice(0);
  for (let i = 0; i < level.words.length; i++) {
    const word = level.words[i];
    const hgword = createHangmanWord(word.length);
    container.append(hgword)
  }
}

export function createHangmanWord(length) {
  const wordEl = document.createElement("div");
  wordEl.classList.add("hangman-word");
  for (let i = 0; i < length; i++) {
    const segEl = createHangmanSegment()
    wordEl.appendChild(segEl);
    hangmanSegments.push(segEl);
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
  const el = hangmanSegments[i];
  el.innerText = ch;
  if (ch) el.classList.add("used")
  else el.classList.remove("used")

  // const r = Math.floor(i / currentLength);
  // const c = i % currentLength;

  // if (r >= container.children.length) return;
  // if (c >= container.children[r].children.length) return;
  // const el = container.children[r].children[c];
}

export function removeHangmanSegment(i) {
  fillHangmanSegment(i, "")
}


// const method = ch ? "add" : "remove";
// el.classList[method]("used")

