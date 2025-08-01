import globals from "./globals";
import { fillHangmanSegment, removeHangmanSegment } from "./hangman";
import { levels } from "./levels";
import { advanceLevel, clearDownTo } from "./main";
import { $, mod } from "./util";

const ctx = globals.ctx;
const letterArray = globals.letterArray;
function crossoverWords(crossPos, word1, word2) {
  let newWord1 = word1.slice(0, crossPos) + word2.slice(crossPos);
  let newWord2 = word2.slice(0, crossPos) + word1.slice(crossPos);
  return [newWord1, newWord2]
}

function splitByLength(str, length) {
  const result = [];
  for (let i = 0; i < str.length; i += length) {
    result.push(str.slice(i, i + length));
  }
  return result;
}

export function setupWordLoops(levelNum) {
  const { crossPos } = levels[levelNum];
  const words = levels[levelNum].words;

  // balance letters
  const longStr = words.join("");
  const avgLength = longStr.length / words.length;
  if (!Number.isInteger(avgLength)) console.log("length problem", avgLength, longStr)

  let balancedWords = splitByLength(longStr, avgLength)

  for (let c of crossPos) {
    balancedWords = crossoverWords(c, ...balancedWords);
  }

  // create word loops
  globals.currentLength = avgLength;
  const randTurns = Math.floor(Math.random() * globals.currentLength);
  for (let i = 0; i < balancedWords.length; i++) {
    const options = { turns: randTurns }
    if (i == 1) options.size = "big";
    const wl = createWordLoop(balancedWords[i], options);
    $("#game-stage").append(wl);
  }
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

let winTransitioning = false;
function hitLetter(e) {
  if (winTransitioning) return;
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

  const prevLetter = globals.letterArray[globals.letterArray.length - 1];
  const len = globals.currentLength;
  if (letter == prevLetter) return;
  // check if it could be next letter
  const i = letter.getAttribute("data-i");
  const prevI = prevLetter?.getAttribute("data-i");
  // avoid hitting the letter directly above/below
  if (mod(prevI - i, len) == 0) return;
  if (prevI == null || mod(prevI - i, len) == mod(-1, len)) {
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

    fillHangmanSegment(globals.letterArray.length, ch)
    globals.letterArray.push(letter);

    if (globals.letterArray.length == levels[globals.currentLevelNum].words.join("").length) {
      if (isCorrect()) {
        console.log("correct!");
        winTransitioning = true;
        $("#hangman").classList.add("correct")
        setTimeout(() => {
          winTransitioning = false;
          advanceLevel();
        }, 1000)
      }
      else {
        console.log("nope!")
      }
    }
  }
  else if (letter.classList.contains("letter-used")) {
    const idx = globals.letterArray.indexOf(letter);
    // remove down to that point
    clearDownTo(idx)
    return;
  }
}

function isCorrect() {
  const words = levels[globals.currentLevelNum].words;
  const a = letterArray.map(x => x.innerText).join("").toUpperCase();
  const b = words.join("").toUpperCase();
  if (a == b) return true;

  // if two words can be swapped
  if (words.every(x => x.length == words[0].length)) {
    const c = words.reverse().join("").toUpperCase();
    if (a == c) return true;
  }

  // TODO: logic for 3 words?
  return false;
}

window.vm = {
  createWordLoop,
  createLoopLetter,
}