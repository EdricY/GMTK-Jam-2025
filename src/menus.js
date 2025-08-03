import globals from "./globals";
import { allLevelStarts } from "./levels";
import { cleanUpGame, setupDailyGame, setupGame, setupQuickMode, setupSingleMode } from "./main";
import { $, $$ } from "./util";
import { createLoopLetter } from "./wordLoop";

const stages = [
  $("#menu"),
  $("#levels"),
  $("#game-stage"),
  $("#credits"),
]

export function hideAllStages() {
  for (const s of stages) {
    s.classList.add("hidden!");
  }
}

export function showStage(stage) {
  for (const s of stages) {
    if (stage == s) s.classList.remove("hidden!");
    else s.classList.add("hidden!");
  }
}

export function setupMenus() {
  setupMenuBtns();
  setupMenuTitle();
  setupLevelBtns();
}

function setupLevelBtns() {
  let completedLevels = JSON.parse(localStorage.getItem("wl-progress")) ?? [];
  $$(".level-btn").forEach((x, i) => {
    x.setAttribute("data-level", allLevelStarts[i]);
    if (completedLevels.includes(i)) {
      x.classList.add("complete");
    }

    // if (i != 0) {
    //   x.setAttribute("disabled", true);
    // }
  })

  $("#levels").addEventListener("click", e => {
    if (e.target.classList.contains("level-btn")) {
      showStage($("#game-stage"));
      const levelNum = e.target.getAttribute("data-level");
      setupGame(levelNum);
    }
  });

  $$(".daily-game-btn").forEach(x => x.addEventListener("click", e => {
    showStage($("#game-stage"));
    setupDailyGame();
  }));


  $("#single-mode-btn").addEventListener("click", e => {
    showStage($("#game-stage"));
    setupSingleMode();
  });
  $("#quick-play-btn").addEventListener("click", e => {
    showStage($("#game-stage"));
    setupQuickMode();
  });


}


function setupMenuBtns() {
  $("#play-btn").addEventListener("click", e => {
    showStage($("#levels"));
  });

  $("#credits-btn").addEventListener("click", e => {
    showStage($("#credits"));
  });

  $$(".back-to-menu-btn").forEach(x => x.addEventListener("click", e => {
    cleanUpGame();
    showStage($("#menu"));
  }));

  $("#ingame-back-btn").addEventListener("click", e => {
    if (globals.winTransitioning) return;
    cleanUpGame();
    showStage($("#levels"));
    // TODO: maybe need to check current level
  });
}

function setupMenuTitle() {
  const outer1 = document.createElement("div");
  outer1.classList.add("title-loop")

  let cursor = outer1;
  "word".split("").forEach(ch => {
    const l = createTitleLetter(ch, -1);
    cursor.append(l)
    cursor = l;
  });
  $("#menu-header").append(outer1);


  const outer2 = document.createElement("div");
  outer2.classList.add("title-loop")
  outer2.classList.add("title-inner-loop")
  cursor = outer2
  "looper".split("").forEach(ch => {
    const l = createTitleLetter(ch, -1);
    cursor.append(l)
    cursor = l;
  });

  $("#menu-header").append(outer2);
}


export function createTitleLetter(ch, idx) {
  const wrapEl = document.createElement("div");
  wrapEl.classList.add("letter-wrap");

  const hitbox = document.createElement("div");
  hitbox.classList.add("letter");
  hitbox.setAttribute("data-i", idx)

  const el = document.createElement("div");
  el.classList.add("letter-circle");
  el.innerText = ch;

  wrapEl.appendChild(hitbox);
  hitbox.appendChild(el);
  return wrapEl;
}
