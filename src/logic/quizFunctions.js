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

/**
 * Picks two wrong answers alongside the correct romaji.
 * Uses combo vs basic pool separation and confusion-map hints when available.
 */
export const generateChoices = (item) => {
  if (!item) return [];

  if (item.type === 'numbers') {
    const candidates = Object.keys(NUM_DICT)
      .map((k) => NUM_DICT[k].romaji)
      .filter((c) => c !== item.romaji);
    const chosen = candidates.sort(() => 0.5 - Math.random()).slice(0, 2);
    return [item.romaji, ...chosen].sort(() => 0.5 - Math.random());
  }

  const comboKeys = COMBO_GRID.flat().filter((k) => k !== null);
  const basicKeys = [...BASIC_GRID.flat(), ...DAKUON_GRID.flat()].filter(
    (k) => k !== null,
  );
  const isComboItem = comboKeys.includes(item.romaji);
  const activePool = isComboItem ? comboKeys : basicKeys;
  const candidates = activePool.filter((c) => c !== item.romaji);

  let d1;
  let d2;

  const smartDistractors = (CONFUSION_MAP[item.romaji] || []).filter((c) =>
    candidates.includes(c),
  );

  if (smartDistractors.length >= 2) {
    const shuffled = smartDistractors.sort(() => 0.5 - Math.random());
    d1 = shuffled[0];
    d2 = shuffled[1];
  } else if (smartDistractors.length === 1) {
    d1 = smartDistractors[0];
    const remaining = candidates.filter((c) => c !== d1);
    d2 = remaining[Math.floor(Math.random() * remaining.length)];
  } else {
    const shuffled = candidates.sort(() => 0.5 - Math.random());
    d1 = shuffled[0];
    d2 = shuffled[1];
  }

  return [item.romaji, d1, d2].sort(() => 0.5 - Math.random());
};
