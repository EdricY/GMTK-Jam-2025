import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { createWordLoop, setupWordLoops } from './wordLoop.js'
import { $ } from './util.js'
import { createHangmanWord, removeHangmanSegment, setupHangman } from './hangman.js'

window.ctx = $("#canvas").getContext("2d");
window.cursor = { x: 0, y: 0 };
window.letterArray = [];
window.currentLength = 8;

const resizeCanvas = (e) => {
  console.log(e)
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

$("#start-btn").addEventListener("click", setupGame);


function setupGame() {
  $("#menu").classList.add("hidden!");
  $("#game-stage").classList.remove("hidden!");
  setupWordLoops();
  setupHangman(currentLength);

  ctx.fillText(window.devicePixelRatio, 10 , 10)
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