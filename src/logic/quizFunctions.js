import {
  KANA_DICT,
  NUM_DICT,
  CONFUSION_MAP,
  COMBO_GRID,
  BASIC_GRID,
  DAKUON_GRID,
} from '../data/kanaData';

/**
 * Organizes the quiz queue so the same character doesn't appear
 * twice in a row (prevents accidental double-tap answers).
 */
export const sanitizeQueue = (queue) => {
  const q = [...queue];
  for (let i = 0; i < q.length - 1; i++) {
    if (q[i].id === q[i + 1].id) {
      let swapIdx = i + 2;
      while (swapIdx < q.length && q[swapIdx].id === q[i].id) swapIdx++;
      if (swapIdx < q.length) [q[i + 1], q[swapIdx]] = [q[swapIdx], q[i + 1]];
    }
  }
  return q;
};

const CHOICE_COUNTS = [3, 4, 5, 6];

/** Total answers shown, including the correct one. */
export const normalizeChoiceCount = (count) =>
  CHOICE_COUNTS.includes(count) ? count : 3;

/**
 * Picks wrong answers alongside the correct romaji.
 * Uses combo vs basic pool separation and confusion-map hints when available.
 */
export const generateChoices = (item, choiceCount = 3) => {
  if (!item) return [];
  const distractorCount = normalizeChoiceCount(choiceCount) - 1;

  const pickDistractors = (candidates, preferred = []) => {
    const unique = [...new Set(candidates.filter((c) => c && c !== item.romaji))];
    const picked = [];
    const take = (list) => {
      const shuffled = [...list].sort(() => Math.random() - 0.5);
      for (const candidate of shuffled) {
        if (picked.length >= distractorCount) break;
        if (!picked.includes(candidate)) picked.push(candidate);
      }
    };
    take(preferred.filter((c) => unique.includes(c)));
    take(unique);
    return picked;
  };

  if (item.type === 'numbers') {
    const candidates = Object.keys(NUM_DICT).map((k) => NUM_DICT[k].romaji);
    const chosen = pickDistractors(candidates);
    return [item.romaji, ...chosen].sort(() => Math.random() - 0.5);
  }

  const comboKeys = COMBO_GRID.flat().filter((k) => k !== null);
  const basicKeys = [...BASIC_GRID.flat(), ...DAKUON_GRID.flat()].filter(
    (k) => k !== null,
  );
  const isComboItem = comboKeys.includes(item.romaji);
  const activePool = isComboItem ? comboKeys : basicKeys;
  const chosen = pickDistractors(
    activePool,
    CONFUSION_MAP[item.romaji] || [],
  );
  return [item.romaji, ...chosen].sort(() => Math.random() - 0.5);
};

/**
 * Kana (or number glyph) for a romaji answer, in the same script as the prompt.
 * Choice lists stay romaji so grading does not change.
 */
export const glyphForRomaji = (romaji, item) => {
  if (!item) return romaji;
  if (romaji === item.romaji) return item.char;
  if (item.type === 'numbers') {
    const match = Object.values(NUM_DICT).find((entry) => entry.romaji === romaji);
    return match?.char ?? romaji;
  }
  const entry = KANA_DICT[romaji];
  if (!entry) return romaji;
  return item.type === 'katakana' ? entry.k : entry.h;
};
