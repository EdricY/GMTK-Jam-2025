const START_DAY = 20303;

export function getDailyLevel() {
  const now = new Date();
  const ms = now.getTime() - now.getTimezoneOffset() * 60 * 1000;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const idx = days - START_DAY;
  return dailyLevels[idx % dailyLevels.length];
}

export const dailyLevels = [
  { words: ["warmth", "prince"], crossPos: [2, 4, 5, 7], hintsA: [0], hintsB: [0] },
  { words: ['mountain', 'vacation'], crossPos: [1, 3, 4, 7] },
  { words: ['careless', 'whispers'], crossPos: [4, 5, 6] },
  { words: ['railway', 'ancient'], crossPos: [1, 2, 3, 5] },
  { words: ['quickly', 'bubbles'], crossPos: [1, 4] },
  { words: ['freshly', 'himself'], crossPos: [2, 3, 4] },
]
