import globals from "./globals";
import { fillHangmanSegment, removeHangmanSegment } from "./hangman";
import { levels } from "./levels";
import { advanceLevel, clearArray, clearDownTo } from "./main";
import { $, $$, mod, swap } from "./util";
import dingPath from "./ding.mp3"
const dingSound = new Audio(dingPath)

const ctx = globals.ctx;
const letterArray = globals.letterArray;
function crossoverWords(crossPos, word1, word2) {
  if (crossPos >= word1.length || crossPos <= 0) {
    console.log("cross outside range:", crossPos)
    return [word1, word2];
  }
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

export function setupWordLoops(level) {
  const { crossPos = [], words } = level;

  // balance letters
  const longStr = words.join("");
  const rings = level.numRings ?? Math.min(words.length, 2);
  const avgLength = longStr.length / rings;
  if (!Number.isInteger(avgLength)) console.log("length problem", avgLength, longStr)

  let balancedWords = splitByLength(longStr, avgLength)

  for (let c of crossPos) {
    balancedWords = crossoverWords(c, ...balancedWords);
  }

  // create word loops
  globals.currentLength = avgLength;
  globals.outsideStart = true;
  const randTurns = Math.floor(Math.random() * globals.currentLength);
  if (rings > 1 && Math.random() > 0.5) {
    globals.outsideStart = false;
    swap(balancedWords, 0, 1);
  }
  for (let i = 0; i < rings; i++) {
    const options = { turns: randTurns }
    if (i == 0) options.size = "big";
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
    el.classList.add("big");
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
  if (globals.winTransitioning) return;
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
    if (!prevLetter) {
      ctx.beginPath();
      ctx.moveTo(pos.x + pos.width / 2, pos.y + pos.height / 2);
    }
    else {
      ctx.lineTo(pos.x + pos.width / 2, pos.y + pos.height / 2);
      ctx.strokeStyle = "#1c122c44";
      ctx.stroke();
    }


    fillHangmanSegment(globals.letterArray.length, ch)
    globals.letterArray.push(letter);

    if (globals.letterArray.length == globals.currentLevel.words.join("").length) {
      if (isCorrect()) {
        if (globals.audio == "1") dingSound.play();

        globals.winTransitioning = true;

        ctx.closePath();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = "#1c122c";
        ctx.stroke();
        $("#hangman").classList.add("correct")
        $("#canvas").classList.add("correct")
        $("#instruction").classList.add("correct")
        $("#canvas").animate([
          {
            opacity: 1, filter: "saturate(100%) hue-rotate(0deg)"
          },
          { opacity: 1 },
          { opacity: 1 },
          { opacity: 1, filter: `saturate(500%) hue-rotate(${180 + Math.floor(Math.random() * 360)}deg)` },
          { opacity: 0, filter: "saturate(100%) hue-rotate(0deg)" },
        ],
          { duration: 1800, fill: "both" }
        );

        $$(".wordLoop").forEach(x => x.classList.add("correct"))
        setTimeout(() => {
          globals.winTransitioning = false;
          advanceLevel();
        }, 2000)
      }
      else {
        $("#hangman").animate([
          { transform: "translateX(0)" },
          { transform: "translateX(1%)" },
          { transform: "translateX(-1%)" },
          { transform: "translateX(0)" },
        ],
          { duration: 200 }
        )
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
  const words = globals.currentLevel.words;
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

window.addEventListener("pointerup", () => {
  if (globals.currentLevelNum == 0) return;
  if (!globals.winTransitioning) clearArray();
});
window.addEventListener("mousedown", () => {
  if (globals.currentLevelNum == 0) return;
  if (!globals.winTransitioning) clearArray();
});
