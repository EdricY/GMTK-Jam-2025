const START_DAY = 20303
const offset = 0;

export function getDailyLevel() {
  const now = new Date();
  const ms = now.getTime() - now.getTimezoneOffset() * 60 * 1000;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + offset;
  const idx = days - START_DAY;
  return dailyLevels[idx % dailyLevels.length];
}

export const dailyLevels = [
  { words: ['mountain', 'vacation'], crossPos: [1, 3, 4, 7] },
  { words: ['careless', 'whispers'], crossPos: [4, 5, 6] },
  { words: ['forever', 'alone'], crossPos: [4, 5, 6] },
  { words: ['silent', 'majority'], crossPos: [2, 4] },
  { words: ['unexamined', 'life'], crossPos: [1, 2, 3] },
  { words: ['railway', 'ancient'], crossPos: [1, 2, 3, 5] },
  { words: ['quickly', 'bubbles'], crossPos: [1, 4] },
  { words: ['future', 'decision'], crossPos: [2, 3, 4] },
  { words: ['pattern', 'factory'], crossPos: [2, 4] },
  { words: ['criminal', 'thirteen'], crossPos: [2, 4] },
  { words: ['modern', 'design'], crossPos: [3, 4] },
  { words: ['shift', 'happens'], crossPos: [4] },
  { words: ['golden', 'ticket'], crossPos: [3] },
  { words: ['glazed', 'doughnut'], crossPos: [2, 3, 4] },
  { words: ['fighter', 'pilot'], crossPos: [1, 4] },
  { words: ['unforsaken', 'roar'], crossPos: [2, 3, 5] },
  { words: ['negative', 'spaces'], crossPos: [1, 3] },
  { words: ['haunted', 'mansion'], crossPos: [3, 4, 5] },
  { words: ['awesome', 'sauce'], crossPos: [2, 3] },
  { words: ['beyond', 'infinity'], crossPos: [1, 3, 4] },
  { words: ['filthy', 'animal'], crossPos: [1, 4] },
  { words: ['emotional', 'support'], crossPos: [2, 5] },
  { words: ['ignore', 'detail'], crossPos: [2, 3, 4] },
  { words: ['marriage', 'proposal'], crossPos: [1, 4] },
  { words: ['allied', 'forces'], crossPos: [2, 5] },
  { words: ['secretly', 'romantic'], crossPos: [1, 3] },
  { words: ['chemical', 'physical'], crossPos: [2, 5] },
  { words: ['artistic', 'original'], crossPos: [1, 3, 4] },
  { words: ['beverly', 'hills'], crossPos: [2, 4] },
  { words: ['curiosity', 'rover'], crossPos: [1, 4, 5] },
  { words: ['artificial', 'prompt'], crossPos: [1, 3, 5] },
  { words: ['triangle', 'window'], crossPos: [1, 2, 5] },
  { words: ['universal', 'right'], crossPos: [2, 3, 5] },
  { words: ['embrace', 'challenge'], crossPos: [2, 3, 6] },
  { words: ['pitch', 'meeting'], crossPos: [1, 4] },
]

