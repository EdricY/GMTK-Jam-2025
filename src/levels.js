import { $$ } from "./util";

export const levels = [
  "1. Beginnings",
  { words: ['fountain'], crossPos: [], hintsA: [0, 3, 5], instruction: "Find the word in the circle! Trace around from the starting letter." },
  { words: ['pillow'], crossPos: [], instruction: "Always trace clockwise."},
  { words: ['circles'], crossPos: []},
  { words: ['high', 'jump'], numRings: 1, crossPos: [], instruction: "The solution may be more than one word." },
  { words: ['good', 'news'], numRings: 1, crossPos: [], },
  "2. Pithy",
  { words: ['peanut', 'butter'], crossPos: [2, 3], hintsA: [0, 3, 5], hintsB: [3] },
  { words: ['dream', 'big'], numRings: 1, crossPos: [], },
  { words: ['island', 'nation'], crossPos: [2, 4], instruction: "Blue lines show where you'll need to trace." },
  { words: ['modern', 'design'], crossPos: [4] },
  { words: ['mystery', 'pyramid'], crossPos: [4] },
  "3. Something",
  { words: ['mountain', 'vacation'], crossPos: [4] },
  { words: ['careless', 'whispers'], crossPos: [4] },
  { words: ['jungle', 'temple'], crossPos: [3] },
  { words: ['shift', 'happens'], crossPos: [4] },
  { words: ['tomorrow', 'alphabet'], crossPos: [4] },
  "4. Something",
  { words: ['mountain', 'vacation'], crossPos: [4] },
  { words: ['careless', 'whispers'], crossPos: [4] },
  { words: ['golden', 'ticket'], crossPos: [3] },
  { words: ['central', 'markets'], crossPos: [4] },
  { words: ['shift', 'happens'], crossPos: [4] },
  "5. Something",
  { words: ['unauthorized', 'access'], crossPos: [4] },
  { words: ['scientific', 'method'], crossPos: [4] },
  { words: ['unexamined', 'life'], crossPos: [4] },
  { words: ['careless', 'whispers'], crossPos: [4] },
  "6. Something",
  
  // { words: ['word    ', '  looper'], crossPos: [], hints: [0, 3, 5] },
  { words: ['thanks', 'for', "playing"], crossPos: [4], instruction: "Nice lol." },
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
  console.log(levelNum)
  let i = allLevelStarts.length - 1;
  while (i >= 0) {
    if (allLevelStarts[i] <= levelNum) break;
    i--;
  }
  $$(".level-btn")[i].classList.add("complete");
  $$(".level-btn")[i+1].removeAttribute("disabled");


  // TODO: update local storage on unlocks
}



// silent planet
// fighter pilot
// weekend warrior
// winter wonderland
// sign language
// pickled peppers

// scientific method
// nuclear fission
// cell division
// chemical reaction

// brain chemistry
// neural pathways
// special needs
// attention deficit
// long term memory
// neural cortex
// cerebral cortex

// daily workout
// workout music
// fitness challenge
// fitness tracker
// endurance running
// calories burned
// interval training

// general knowledge
// private matters
// major cleanup
// corporal punishment

// silent majority

// better together
// together always
// birthday surprise
// forever alone
// friends forever

// unexamined life
// domestic kitten

// cross examine
// eviction notice
// traffic violation
// public defender
// arrest warrant
// written testimony

// record player

// moby dick
// three body problem
// children of time
// the great gatsby
// the grapes of wrath
// the little prince

// pitch meeting

// mission control
// space shuttle
// aurora borealis
// ultraviolet light
// blue supergiant
// event horizon
// absolute zero
// time dilation
// rocket engine

// winter is coming

// consumer debt
// savings account
// retirement plan
// spending habits
// compound interest

// quarterly meeting
// project manager
// bleeding edge
// chief executive
// human resources
// marginal profit

// code repository
// virtual reality
// digital marketing
// click through rate
// user experience

// encrypted message
// network bandwidth
// threat detection
// security protocol
// unauthorized access
// registry editor

// vanilla extract
// whipped cream
// apple crumble
// almond biscotti
// cherry turnover
// cinnamon danish
// glazed doughnut

// shutter speed
// white balance
// light sensitivity
// depth of field
// dynamic range
// exposure triangle
// long exposure

// bohemian rhapsody
// drivers license
// dangerous woman
// say something
// single ladies
// misery business
// 


