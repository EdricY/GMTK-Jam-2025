import './style.css'
import { createWordLoop, setupWordLoops } from './wordLoop.js'
import { $, $$, mod, randEl, randInt, swap } from './util.js'
import { createHangmanWord, removeHangmanSegment, setupHangman } from './hangman.js'
import { setupMenus, showStage } from './menus.js'
import { getRandomQuickLevels, getRandomSingles, getTitle, levels, setComplete } from './levels.js'
import globals from './globals.js'
import { words6 } from './dictionary-6.js'
import { getDailyLevel } from './daily.js'

setupMenus();
const ctx = globals.ctx;
const letterArray = globals.letterArray;

const handleResize = (e) => {
  // console.log(window.innerHeight);
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
  clearArray();
  // ctx.fillText(window.devicePixelRatio || 1, 100 , 100)
  // ctx.fillText(window.innerWidth || 1, 100 , 200)
}
window.addEventListener("load", handleResize);
window.addEventListener("resize", handleResize);
handleResize();

export function advanceLevel() {
  globals.currentLevelNum = Number(globals.currentLevelNum) + 1;
  let level;
  if (globals.currentLevelNum >= SINGLE_START && globals.currentLevelNum < SINGLE_END) {
    level = globals.singleLevels[globals.currentLevelNum - SINGLE_START];
    $("#level-title").innerText = `${globals.currentLevelNum - SINGLE_START + 1} / 10`
    cleanUpGame();
    setupGameLevel(level);
    globals.currentLevel = level
    return;

  }
  else if (globals.currentLevelNum >= QUICK_START && globals.currentLevelNum < QUICK_END) {
    level = globals.quickLevels[globals.currentLevelNum - QUICK_START];
    $("#level-title").innerText = `${globals.currentLevelNum - QUICK_START + 1} / 5`
    cleanUpGame();
    setupGameLevel(level);
    globals.currentLevel = level
    return;
  }
  else {
    level = levels[globals.currentLevelNum];
  }

  cleanUpGame();
  if (level?.words) {
    globals.currentLevel = level
    setupGame(globals.currentLevelNum);
  } else {
    // no next level, return to levels
    setComplete(globals.currentLevelNum - 1);
    globals.currentLevelNum = 0;
    globals.currentLevel = null;
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
  $("#level-title").innerText = getTitle(Number(levelNum))
  setupGameLevel(level)
}

export function setupDailyGame() {
  globals.currentLevelNum = -1;
  const level = getDailyLevel();
  $("#level-title").innerText = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",

  })
  setupGameLevel(level)
}

const SINGLE_START = -30;
const SINGLE_END = -20;
export function setupSingleMode() {
  globals.currentLevelNum = SINGLE_START;
  globals.singleLevels = getRandomSingles();
  const level = globals.singleLevels[0];
  $("#level-title").innerText = "1 / 10";
  setupGameLevel(level);
}

const QUICK_START = -50;
const QUICK_END = -45;
export function setupQuickMode() {
  globals.currentLevelNum = QUICK_START;
  globals.quickLevels = getRandomQuickLevels();
  const level = globals.quickLevels[0];
  $("#level-title").innerText = "1 / 5"
  setupGameLevel(level)
}


export function setupGameLevel(level) {
  globals.currentLevel = level;
  setupWordLoops(level);
  setupHangman(level);

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

const HINT_TIME = 30000;
let hintTimeout = null;
$("#hint-btn").addEventListener("click", () => {
  if (!globals.currentLevel) return;
  let attempts = 0;
  let r = randInt(0, globals.currentLength - 1);
  while (attempts < 20) {
    if (!globals.currentLevel.hintsA?.includes(r)) break;
    if (!globals.currentLevel.hintsB?.includes(r)) break;
    r = mod(r + 1);
    attempts++;
  }

  if (!globals.currentLevel.hintsA) globals.currentLevel.hintsA = [];
  if (!globals.currentLevel.hintsB) globals.currentLevel.hintsB = [];
  globals.currentLevel.hintsA.push(r);
  globals.currentLevel.hintsB.push(r);
  drawHints();
  $("#hint-btn").disabled = true;
  clearTimeout(hintTimeout);
  $("#hint-btn").animate([
    { backgroundPosition: "0%" },
    { backgroundPosition: "100%" }
  ], { duration: HINT_TIME })
  setTimeout(() => {
    $("#hint-btn").disabled = false;
  }, HINT_TIME)

})

export function drawHints() {
  if (globals.currentLevelNum == 0) return;
  const { hintsA = [], hintsB = [], crossPos = [] } = globals.currentLevel;
  if (!hintsA && !hintsB) return;

  let [aLoop, bLoop] = $$(".wordLoop");
  if (!aLoop) return;

  if (!globals.outsideStart) {
    let temp = aLoop;
    aLoop = bLoop;
    bLoop = temp;
  }

  const starts = []
  const ends = []
  for (const hint of hintsA) {
    if (!aLoop) break;
    if (mod(hint) == 0) continue; // would connect to starting letter
    const end = aLoop.querySelector(`.letter[data-i='${mod(hint)}']`);
    let start;
    if (crossPos.includes(hint)) start = bLoop.querySelector(`.letter[data-i='${mod(hint - 1)}']`);
    else start = aLoop.querySelector(`.letter[data-i='${mod(hint - 1)}']`);
    starts.push(start);
    ends.push(end);
  }
  for (const hint of hintsB) {
    if (!bLoop) break;
    if (mod(hint) == 0) continue; // would connect to starting letter
    const end = bLoop.querySelector(`.letter[data-i='${mod(hint)}']`);
    let start;
    if (crossPos.includes(hint)) start = aLoop.querySelector(`.letter[data-i='${mod(hint - 1)}']`);
    else start = bLoop.querySelector(`.letter[data-i='${mod(hint - 1)}']`)
    starts.push(start);
    ends.push(end);
  }

  if (bLoop && (hintsA.includes(0) || hintsB.includes(0))) {
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
