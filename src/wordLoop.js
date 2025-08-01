import { fillHangmanSegment, removeHangmanSegment } from "./hangman";
import { clearDownTo } from "./main";
import { $, mod } from "./util";

function crossoverWords(crossPos, word1, word2) {
  let newWord1 = word1.slice(0, crossPos) + word2.slice(crossPos);
  let newWord2 = word2.slice(0, crossPos) + word1.slice(crossPos);
  return [newWord1, newWord2]
}

export function setupWordLoops() {
  const crossPos = 4;
  let word1 = "tomorrow";
  let word2 = "alphabet";

  [word1, word2] = crossoverWords(crossPos, word1, word2);

  const wl = createWordLoop(word1);
  const wl2 = createWordLoop(word2, { size: "big" });

  // const wl = createWordLoop("circle");
  // const wl2 = createWordLoop("powers", { size: "big", turns: 0 });

  $("#game-stage").append(wl);
  $("#game-stage").append(wl2);
}

export function createWordLoop(word, { size, turns = 0 } = {}) {
  const el = document.createElement("div");
  el.classList.add("wordLoop")
  let cursor = el;
  for (let idx = 0; idx < word.length; idx++) {
    const ch = word[idx]
    const newLetter = createLoopLetter(ch, idx);
    cursor.appendChild(newLetter);
    cursor = newLetter;
  }

  const deg = 360 / word.length;
  el.firstElementChild.style.rotate = `${deg}deg`;

  const turnDeg = turns * deg;
  el.style.rotate = `${turnDeg}deg`;

  if (!size || size == "small") {
    el.classList.add("size-64");
  } else {
    el.classList.add("size-96");
    el.style.rotate = `${turnDeg}deg`;
  }
  return el;
}

export function createLoopLetter(ch, idx) {
  const wrapEl = document.createElement("div");
  wrapEl.classList.add("letter-wrap");

  const hitbox = document.createElement("div");
  hitbox.classList.add("letter");
  hitbox.setAttribute("data-i", idx)

  hitbox.addEventListener("pointermove", hitLetter, true);
  hitbox.addEventListener("pointerenter", hitLetter, true);

  const el = document.createElement("div");
  el.classList.add("letter-circle");
  el.innerText = ch;

  wrapEl.appendChild(hitbox);
  hitbox.appendChild(el);
  return wrapEl;
}

function hitLetter(e) {
  let letter;
  // find what we're hitting (easy for mouse, hard for touch)
  if (e.pointerType == "mouse") {
    letter = e.currentTarget
  } else if (e.pointerType == "touch") {
    letter = document.elementFromPoint(e.x, e.y);
    if (letter.classList.contains("letter")) {
      // good, fall through
    }
    else if (letter.classList.contains("letter-circle")) {
      letter = letter.parentElement;
    }
    else {
      // not targeting a letter
      return;
    }
  }

  const prevLetter = letterArray[letterArray.length - 1];
  if (letter == prevLetter) return;
  // check if it could be next letter
  const i = letter.getAttribute("data-i");
  const prevI = prevLetter?.getAttribute("data-i");
  if (prevI == null || mod(prevI - i, currentLength) == mod(-1, currentLength)) {

    // not a new letter, do nothing (avoid accidental clearing)
    if (letter.classList.contains("letter-used")) return;

    // new letter
    letter.classList.add('letter-used');
    const ch = letter.innerText;

    const pos = letter.getBoundingClientRect();

    ctx.lineTo(pos.x + pos.width / 2, pos.y + pos.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x + pos.width / 2, pos.y + pos.height / 2);

    fillHangmanSegment(letterArray.length, ch)
    letterArray.push(letter);
  }
  else if (letter.classList.contains("letter-used")) {
    const idx = letterArray.indexOf(letter);
    // remove down to that point
    clearDownTo(idx)
    return;
  }
}

window.vm = {
  createWordLoop,
  createLoopLetter,
}