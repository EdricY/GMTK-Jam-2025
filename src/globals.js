import { $ } from "./util";

const globals = {};
globals.ctx = $("#canvas").getContext("2d");
globals.cursor = { x: 0, y: 0 };
globals.letterArray = [];
globals.currentLength = 8;
globals.currentLevelNum = 0;
globals.currentLevel = null;
globals.winTransitioning = false;
globals.singleLevels = []

export default globals;