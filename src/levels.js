import { words6 } from "./dictionary-6";
import { words7 } from "./dictionary-7";
import { words8 } from "./dictionary-8";
import globals from "./globals";
import { $$, randEl, randInt } from "./util";

export const levels = [
  "1. Beginning",
  { words: ['fountain'], crossPos: [], instruction: "Find the word in the circle! Trace around from the starting letter." },
  { words: ['pillow'], crossPos: [], instruction: "Always trace clockwise." },
  { words: ['circles'], crossPos: [] },
  { words: ['separate'], crossPos: [] },
  { words: ['struggle'], crossPos: [] },

  "2. Pairwise",
  { words: ['good', 'news'], numRings: 1, crossPos: [], instruction: "The solution may be more than one word." },
  { words: ['high', 'jump'], numRings: 1, crossPos: [], },
  { words: ['slow', 'down'], numRings: 1, crossPos: [], },
  { words: ['true', 'love'], numRings: 1, crossPos: [], },
  { words: ['dream', 'big'], numRings: 1, crossPos: [], },

  "3. Loop de Loop",
  { words: ['peanut', 'butter'], crossPos: [], hintsA: [1], hintsB: [0], instruction: "Blue lines hint where you'll need to trace." },
  { words: ['whipped', 'cream'], crossPos: [], hintsB: [0], instruction: "Words may use letters from either loop" },
  { words: ['apple', 'crumble'], crossPos: [] },
  { words: ['pickled', 'peppers'], crossPos: [3, 4], hintsA: [4], hintsB: [3] },
  { words: ['vanilla', 'extract'], crossPos: [3], hintsA: [3], hintsB: [3], },

  // { words: ['modern', 'design'], crossPos: [4], hintsB: [4] },
  // { words: ['mystery', 'pyramid'], crossPos: [4] },
  // { words: ['mountain', 'vacation'], crossPos: [4] },
  // { words: ['jungle', 'temple'], crossPos: [3] },
  // { words: ['shift', 'happens'], crossPos: [4] },
  // { words: ['island', 'nation'], crossPos: [2, 4], hintsA: [2], hintsB: [2] },
  // { words: ['careless', 'whispers'], crossPos: [4] },

  "4. By the book",
  { words: ['jury', 'duty'], numRings: 1, crossPos: [], },
  { words: ['cross', 'examine'], crossPos: [], hintsA: [4], hintsB: [2], },
  { words: ['court', 'mandate'], crossPos: [3], hintsA: [2], hintsB: [2], },
  { words: ['eviction', 'notice'], crossPos: [2, 5], hintsA: [3], hintsB: [1], },
  { words: ['public', 'defender'], crossPos: [], },
  { words: ['traffic', 'violation'], crossPos: [1, 3, 6], },
  { words: ['written', 'testimony'], crossPos: [2, 3, 5, 6], },

  "5. All in your head",
  { words: ['brain', 'chemistry'], crossPos: [], hintsA: [4], hintsB: [4] },
  { words: ['neural', 'pathways'], crossPos: [3], hintsA: [3], },
  { words: ['attention', 'deficit'], crossPos: [4], },
  { words: ['cerebral', 'cortex'], crossPos: [3, 5], hintsB: [3], },
  { words: ['long', 'term', 'memory'], crossPos: [1, 2, 3], },

  "6. Benched",
  { words: ['workout', 'music'], crossPos: [], },
  { words: ['fitness', 'tracker'], crossPos: [3], hintsA: [2], },
  { words: ['calories', 'burned'], crossPos: [4], hintsB: [2], },
  { words: ['interval', 'training'], crossPos: [2, 5], },
  { words: ['daily', 'stretches'], crossPos: [3], },

  // endurance running
  "7. Spacing Out",
  { words: ['mission', 'control'], crossPos: [], },
  { words: ['rocket', 'engine'], crossPos: [4], hintsA: [2] },
  { words: ['aurora', 'borealis'], crossPos: [4], hintsB: [2] },
  { words: ['event', 'horizon'], crossPos: [3, 5], hintsB: [3] },
  { words: ['time', 'dilation'], crossPos: [4], },
  // { words: ['blue','supergiant'], crossPos: [], },
  // space shuttle
  // ultraviolet light
  // blue supergiant 

  "8. Under the microscope",
  { words: ['scientific', 'method'], crossPos: [], hintsA: [1] },
  { words: ['absolute', 'zero'], crossPos: [], hintsB: [5] },
  { words: ['cell', 'division'], crossPos: [4], },
  { words: ['chemical', 'reaction'], crossPos: [3, 5], },
  { words: ['nuclear', 'fission'], crossPos: [2, 4, 5], },

  "9. Unranked",
  { words: ['general', 'knowledge'], crossPos: [3], hintsA: [3] },
  { words: ['private', 'matters'], crossPos: [4], hintsB: [2] },
  { words: ['major', 'cleanup'], crossPos: [2], },
  { words: ['corporal', 'punishment'], crossPos: [2, 5], },

  "10. A Taxing Situation",
  { words: ['consumer', 'debt'], crossPos: [4], hintsA: [4], hintsB: [4] },
  { words: ['savings', 'account'], crossPos: [2], },
  { words: ['retirement', 'plan'], crossPos: [3], },
  { words: ['spending', 'habits'], crossPos: [3, 5], hintsA: [5] },
  { words: ['compound', 'interest'], crossPos: [2, 4], },

  "11. Climbing the Ladder",
  { words: ['profit', 'margin'], crossPos: [3], hintsA: [3], hintsB: [3] },
  { words: ['project', 'manager'], crossPos: [2, 5], hintsA: [2], hintsB: [4] },
  { words: ['human', 'resources'], crossPos: [1, 4], hintsA: [4] },
  { words: ['quarterly', 'meeting'], crossPos: [3], hintsA: [3] },
  { words: ['chief', 'executive'], crossPos: [3, 5], },

  "12. Super User",
  { words: ['encrypted', 'message'], crossPos: [2, 5], hintsA: [5], hintsB: [5] },
  { words: ['zero', 'day', 'exploit'], crossPos: [1, 3, 4], hintsA: [4, 5], hintsB: [] },
  { words: ['authorized', 'access'], crossPos: [2, 5], hintsA: [2], hintsB: [] },
  { words: ['network', 'bandwidth'], crossPos: [1, 4], hintsA: [], hintsB: [5] },
  { words: ['security', 'protocol'], crossPos: [3, 4, 6] },
  // { words: ['threat', 'detection'], crossPos: [3, 5], hintsA: [], hintsB: [2] },
  // registry editor

  "13. Focus, Please",
  { words: ['shutter', 'speed'], crossPos: [1, 4], hintsA: [4], hintsB: [4] },
  { words: ['white', 'balance'], crossPos: [3, 5], hintsA: [], hintsB: [0, 3] },
  { words: ['light', 'sensitivity'], crossPos: [2, 4], hintsB: [4] },
  { words: ['depth', 'of', 'field'], crossPos: [3, 5], hintsB: [4] },
  { words: ['dynamic', 'range'], crossPos: [2, 5], },
  // exposure triangle
  // long exposure

  "14. Mind Over Metadata",
  { words: ['code', 'repository'], crossPos: [], hintsA: [2], hintsB: [2] },
  { words: ['virtual', 'reality'], crossPos: [3], hintsA: [4, 5], hintsB: [] },
  { words: ['digital', 'marketing'], crossPos: [2, 5], hintsA: [4] },
  { words: ['user', 'experience'], crossPos: [3, 5], hintsB: [5] },
  { words: ['click', 'through', 'rate'], crossPos: [2, 4, 5] },

  "15. Reel Life",
  { words: ['the', 'godfather'], crossPos: [], hintsA: [3], hintsB: [3] },
  { words: ['jurassic', 'park'], crossPos: [1, 3], hintsA: [5], hintsB: [2] },
  { words: ['top', 'gun', 'maverick'], crossPos: [2, 3, 4], hintsA: [], hintsB: [3] },
  { words: ['dead', 'poets', 'society'], crossPos: [4, 5], hintsA: [3], hintsB: [] },
  { words: ['the', 'incredibles'], crossPos: [2, 4, 6] },

  "16. Stuck in Your Head",
  { words: ['misery', 'business'], crossPos: [2], hintsA: [2], hintsB: [2] },
  { words: ['chicken', 'fried'], crossPos: [3, 4], hintsA: [1], hintsB: [4] },
  { words: ['single', 'ladies'], crossPos: [2], hintsA: [], hintsB: [3] },
  { words: ['bohemian', 'rhapsody'], crossPos: [4, 6], hintsA: [5], hintsB: [] },
  { words: ['drivers', 'license'], crossPos: [3, 5, 6], hintsA: [], hintsB: [] },
  { words: ['thanks', 'for', "playing"], crossPos: [5, 6], hintsA: [], hintsB: [] },

  // "15. Knead to Know Basis",
  // { words: ['vanilla', 'extract'], crossPos: [] },
  // { words: ['apple', 'crumble'], crossPos: [] },
  // { words: ['almond', 'biscotti'], crossPos: [] },
  // { words: ['cherry', 'turnover'], crossPos: [] },
  // { words: ['cinnamon', 'danish'], crossPos: [] },
  // whipped cream
  // glazed doughnut
  // misery business
  // chicken fried
  // single ladies
  // bohemian rhapsody


  // say something
  // drivers license
  // dangerous woman


  //The Great Gatsby


  // { words: ['mountain', 'vacation'], crossPos: [4] },
  // { words: ['careless', 'whispers'], crossPos: [4] },
  // { words: ['golden', 'ticket'], crossPos: [3] },
  // { words: ['central', 'markets'], crossPos: [4] },


  // "5. Something",
  // { words: ['shift', 'happens'], crossPos: [4] },
  // { words: ['scientific', 'method'], crossPos: [4] },
  // { words: ['unexamined', 'life'], crossPos: [4] },
  // { words: ['careless', 'whispers'], crossPos: [4] },
  // "6. Something",

  // { words: ['tomorrow', 'alphabet'], crossPos: [4] },
  // { words: ['word    ', '  looper'], crossPos: [], hints: [0, 3, 5] },
]

export function getTitle(levelNum) {
  let i = levelNum;
  let title = levels[i--]
  while (typeof title != "string") {
    title = levels[i--]
  }
  return title;
}

export const allLevelStarts = getAllLevelStarts();
function getAllLevelStarts() {
  const levelStarts = [];
  for (let i = 0; i < levels.length; i++) {
    if (typeof levels[i] == "string") levelStarts.push(i + 1)
  }
  return levelStarts
}

export function setComplete(levelNum) {
  if (levelNum < 0) return;
  let i = allLevelStarts.length - 1;
  while (i >= 0) {
    if (allLevelStarts[i] <= levelNum) break;
    i--;
  }
  const levelBtns = $$(".level-btn");
  levelBtns[i].classList.add("complete");
  // levelBtns[i + 1]?.removeAttribute("disabled");

  const p = JSON.parse(localStorage.getItem("wl-progress")) ?? []
  if (!p.includes(i)) p.push(i);
  localStorage.setItem("wl-progress", JSON.stringify(p));
}

export function getRandomSingles() {
  const randWords = [];
  const listChoices = [0, 1, 1, 2, 2];
  const lists = [words6, words7, words8];
  while (randWords.length < 10) {
    const list = randEl(listChoices);
    const word = randEl(lists[list]);
    if (!randWords.includes(word)) randWords.push(word);
  }
  return randWords.map(w => ({ words: [w] }))
}

export function getRandomQuickLevels() {
  const randWords = [];
  const listChoices = [0, 1, 1, 2, 2];
  const lists = [words6, words7, words8];
  while (randWords.length < 5) {
    const list = randEl(listChoices);
    const word1 = randEl(lists[list]);
    const word2 = randEl(lists[list]);
    if (word1 == word2) continue;
    const flatWords = randWords.flat();
    if (flatWords.includes(word1)) continue;
    if (flatWords.includes(word2)) continue;
    randWords.push([word1, word2]);
  }

  return randWords.map(w => {
    return { words: w, crossPos: getRandomCrossPos(w[0].length) }
  })
}

function getRandomCrossPos(len) {
  const crossPos = Array(len - 1).fill(0).map((_, i) => i + 1)
  for (let i = 0; i < crossPos.length; i++) {
    if (Math.random() < 0.5) crossPos.splice(i--, 1)
  }
  return crossPos;
}
window.getRandomCrossPos = getRandomCrossPos;
// around the world

// silent planet
// fighter pilot
// weekend warrior
// winter wonderland
// sign language
// pickled peppers




// silent majority

// better together
// together always
// birthday surprise
// forever alone
// friends forever

// unexamined life
// domestic kitten



// record player

// moby dick
// three body problem
// children of time
// the great gatsby
// the grapes of wrath
// the little prince

// pitch meeting


// winter is coming

