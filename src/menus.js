import { allLevelStarts } from "./levels";
import { cleanUpGame, setupGame } from "./main";
import { $, $$ } from "./util";

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
  setupLevelBtns();
}

function setupLevelBtns() {
  let unlockedLevels = localStorage.getItem("unlocked");
  $$(".level-btn").forEach((x, i) => {
    x.setAttribute("data-level", allLevelStarts[i]);
    // TODO: look at local storage and disable accordingly
    if ( i == 0) return;
    // x.setAttribute("disabled", true);
  })

  $("#levels").addEventListener("click", e => {
    if (e.target.classList.contains("level-btn")) {
      showStage($("#game-stage"));
      const level = e.target.getAttribute("data-level");
      setupGame(level);
    }
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
    cleanUpGame();
    showStage($("#levels"));
    // TODO: maybe need to check current level
  });


}

