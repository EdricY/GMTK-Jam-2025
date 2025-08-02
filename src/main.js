import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { createWordLoop, setupWordLoops } from './wordLoop.js'
import { $, $$, mod, swap } from './util.js'
import { createHangmanWord, removeHangmanSegment, setupHangman } from './hangman.js'
import { setupMenus, showStage } from './menus.js'
import { getTitle, levels, setComplete } from './levels.js'
import globals from './globals.js'

setupMenus();
const ctx = globals.ctx;
const letterArray = globals.letterArray;

const handleResize = (e) => {
  console.log(window.innerHeight);
  document.documentElement.style.setProperty("--fullHeight", window.innerHeight + "px")
  const dpr = window.devicePixelRatio || 1;
  ctx.canvas.height = document.body.clientHeight * dpr;
  ctx.canvas.width = document.body.clientWidth * dpr;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#1c122c44";
  ctx.scale(dpr, dpr);

  ctx.font = "bold 48px serif";
  ctx.lineJoin = "round";
  // ctx.fillText(window.devicePixelRatio || 1, 100 , 100)
  // ctx.fillText(window.innerWidth || 1, 100 , 200)
}
window.addEventListener("load", handleResize);
window.addEventListener("resize", handleResize);
handleResize();

export function advanceLevel() {
  globals.currentLevelNum = Number(globals.currentLevelNum) + 1;
  cleanUpGame();
  const level = levels[globals.currentLevelNum];
  if (level?.words) {
    setupGame(globals.currentLevelNum);
  } else {
    setComplete(globals.currentLevelNum - 1);
    globals.currentLevelNum = 0;
    cleanUpGame();
    showStage($("#levels"))
  }
}

export function cleanUpGame() {
  $("#hangman").classList.remove("correct");
  $("#canvas").classList.remove("correct");
  $("#instruction").classList.remove("correct");
  $("#hangman").innerHTML = "";
  $$(".wordLoop").forEach(el => {
    el.parentElement.removeChild(el);
  });
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
  letterArray.splice(0);

}

export function setupGame(levelNum) {
  globals.currentLevelNum = levelNum;
  const level = levels[levelNum];
  setupWordLoops(levelNum);
  setupHangman(level);

  $("#level-title").innerText = getTitle(Number(levelNum))

  drawHints();
  $("#canvas").animate([
    { opacity: 0 },
    { opacity: 1 },
  ],
    { duration: 500, delay: 700, fill: "both" }
  );

  if (level.instruction) {
    $("#instruction").classList.remove("hidden!")
    $("#instruction").innerText = level.instruction
  }
  else {
    $("#instruction").classList.add("hidden!")
  }
}

export function drawHints() {
  if (globals.currentLevelNum == 0) return;
  const { hintsA = [], hintsB = [], crossPos = [] } = levels[globals.currentLevelNum]
  if (!hintsA && !hintsB) return;

  let [aLoop, bLoop] = $$(".wordLoop");
  if (!globals.outsideStart) {
    let temp = aLoop;
    aLoop = bLoop;
    bLoop = temp;
  }

  const starts = []
  const ends = []
  for (const hint of hintsA) {
    if (mod(hint) == 0) continue; // would connect to starting letter
    const end = aLoop.querySelector(`.letter[data-i='${mod(hint)}']`);
    let start;
    if (crossPos.includes(hint)) start = bLoop.querySelector(`.letter[data-i='${mod(hint - 1)}']`);
    else start = aLoop.querySelector(`.letter[data-i='${mod(hint - 1)}']`);
    starts.push(start);
    ends.push(end);
  }
  for (const hint of hintsB) {
    if (mod(hint) == 0) continue; // would connect to starting letter
    const end = bLoop.querySelector(`.letter[data-i='${mod(hint)}']`);
    let start;
    if (crossPos.includes(hint)) start = aLoop.querySelector(`.letter[data-i='${mod(hint - 1)}']`);
    else start = bLoop.querySelector(`.letter[data-i='${mod(hint - 1)}']`)
    starts.push(start);
    ends.push(end);
  }

  if (hintsA.includes(0) || hintsB.includes(0)) {
    // consider zero to always mean start of second word (start of b loop)
    const end = bLoop.querySelector(`.letter[data-i='${mod(0)}']`);
    let start;
    // if even crossings, this is an inherent cross
    if (crossPos.length % 2 == 0) start = aLoop.querySelector(`.letter[data-i='${mod(- 1)}']`);
    // if odd crossings, don't cross
    else start = bLoop.querySelector(`.letter[data-i='${mod(- 1)}']`)
    starts.push(start);
    ends.push(end);
  }

  // draw them
  ctx.strokeStyle = "#396392"
  ctx.setLineDash([10, 5]);
  for (let i in starts) {
    ctx.beginPath();
    const pos1 = starts[i]?.getBoundingClientRect();
    const pos2 = ends[i]?.getBoundingClientRect();
    if (!pos1 || !pos2) break;
    ctx.moveTo(pos1.x + pos1.width / 2, pos1.y + pos1.height / 2);
    ctx.lineTo(pos2.x + pos2.width / 2, pos2.y + pos2.height / 2);
    ctx.stroke();
  }
  ctx.setLineDash([])
}

window.drawHints = drawHints;

export function clearArray() {
  clearDownTo(-1);
}

export function clearDownTo(idx) {
  for (let i = letterArray.length - 1; i > idx; i--) {
    letterArray[i].classList.remove('letter-used');;
    removeHangmanSegment(i);
    letterArray.pop();
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawHints();
  // redraw lines
  ctx.strokeStyle = "#1c122c44";
  ctx.beginPath();
  for (let i = 0; i < letterArray.length; i++) {
    const l = letterArray[i];
    const pos = l.getBoundingClientRect();
    if (i == 0) {
      ctx.moveTo(pos.x + pos.width / 2, pos.y + pos.height / 2);
    }
    ctx.lineTo(pos.x + pos.width / 2, pos.y + pos.height / 2);
    ctx.stroke();
  }
}

/*
function tick() {
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick)

*/