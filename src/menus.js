import { setupGame } from "./main";
import { $ } from "./util";

const stages = [
  $("#menu"),
  $("#levels"),
  $("#game-stage"),
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
  setupPlayBtn();
  setupLevelBtns();
}

function setupPlayBtn() {
  $("#play-btn").addEventListener("click", e => {
    showStage($("#levels"))
  });
}

function setupLevelBtns() {
  $("#levels").addEventListener("click", e => {
    if (e.target.classList.contains("level-btn")) {
      showStage($("#game-stage"));
      const level = e.target.getAttribute("data-level");
      setupGame(level);
    }
  });
}

