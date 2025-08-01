import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { createWordLoop, setupWordLoops } from './wordLoop.js'
import { $, $$ } from './util.js'
import { createHangmanWord, removeHangmanSegment, setupHangman } from './hangman.js'
import { setupMenus } from './menus.js'
import { levels } from './levels.js'
import globals from './globals.js'

setupMenus();
const ctx = globals.ctx;
const letterArray = globals.letterArray;

const resizeCanvas = (e) => {
  // console.log("rs", window.innerHeight, window.innerWidth)
  const dpr = window.devicePixelRatio || 1;
  ctx.canvas.height = document.body.clientHeight * dpr;
  ctx.canvas.width = document.body.clientWidth * dpr;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#1c122caa";
  ctx.scale(dpr, dpr);

  ctx.font = "bold 48px serif";
  // ctx.fillText(window.devicePixelRatio || 1, 100 , 100)
  // ctx.fillText(window.innerWidth || 1, 100 , 200)
}
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

resizeCanvas();

export function advanceLevel() {
  globals.currentLevelNum = Number(globals.currentLevelNum) + 1;
  cleanUpGame();
  setupGame(globals.currentLevelNum);
}

export function cleanUpGame() {
  $("#hangman").classList.remove("correct");
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
  setupWordLoops(levelNum);
  setupHangman(levels[levelNum]);
}

window.addEventListener("pointerup", () => {
  clearArray();
});

export function clearArray() {
  clearDownTo(-1);
}

export function clearDownTo(idx) {
  for (let i = letterArray.length - 1; i > idx; i--) {
    letterArray[i].classList.remove('letter-used');;
    removeHangmanSegment(i);
    letterArray.pop();
  }

  // redraw lines
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();
  for (let i = 0; i < letterArray.length; i++) {
    const l = letterArray[i];
    const pos = l.getBoundingClientRect();
    ctx.lineTo(pos.x + pos.width / 2, pos.y + pos.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x + pos.width / 2, pos.y + pos.height / 2);
  }
}

/*
function tick() {
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick)

*/