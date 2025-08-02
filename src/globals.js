import { $ } from "./util";

const globals = {};
globals.ctx = $("#canvas").getContext("2d");
globals.cursor = { x: 0, y: 0 };
globals.letterArray = [];
globals.currentLength = 8;
globals.currentLevelNum = 0;

window.globals = globals;
export default globals;