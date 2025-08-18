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
  $("#settings"),
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
  setupSettings();
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
  $("#settings-btn").addEventListener("click", e => {
    showStage($("#settings"));
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

function setupSettings() {
  $("#hint-setting").addEventListener("change", (e) => {
    if (e.target.checked) $("#hint-btn").classList.remove("hidden!")
    else $("#hint-btn").classList.add("hidden!");
    localStorage.setItem("hint-setting", e.target.checked ? "1" : "0");
  })
  if (localStorage.getItem("hint-setting") == "1") {
    $("#hint-btn").classList.remove("hidden!")
    $("#hint-setting").checked = true;
  }

  $("#small-hitbox-setting").addEventListener("change", (e) => {
    if (e.target.checked) $("#game-stage").classList.add("small-hitbox");
    else $("#game-stage").classList.remove("small-hitbox");
    localStorage.setItem("small-hitbox-setting", e.target.checked ? "1" : "0");
  });
  if (localStorage.getItem("small-hitbox-setting") == "1") {
    $("#game-stage").classList.add("small-hitbox");
    $("#small-hitbox-setting").checked = true;
  }

  $("#audio-setting").addEventListener("change", (e) => {
    globals.audio = e.target.checked ? "1" : "0";
    localStorage.setItem("audio-setting", globals.audio);
  })
  globals.audio = localStorage.getItem("audio-setting") ?? "1"
  $("#audio-setting").checked = globals.audio == "1";

  $("#rotate-btns-setting").addEventListener("change", (e) => {
    if (e.target.checked) {
      $("#rotate-left-btn").classList.remove("hidden!");
      $("#rotate-right-btn").classList.remove("hidden!");
    }
    else {
      $("#rotate-left-btn").classList.add("hidden!");
      $("#rotate-right-btn").classList.add("hidden!");
    }
    localStorage.setItem("rotate-btns-setting", e.target.checked ? "1" : "0");
  })

  if (localStorage.getItem("rotate-btns-setting") == "1") {
    $("#rotate-btns-setting").checked = true;
    $("#rotate-left-btn").classList.remove("hidden!");
    $("#rotate-right-btn").classList.remove("hidden!");
  }

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
