const STORAGE_KEY = 'mojigana-app-state';
const VERSION = 1;

const ID_RE = /^[hkn]_[\w.-]+$/;

let persistTimer = null;

const isPlainObject = (x) =>
  x !== null && typeof x === 'object' && !Array.isArray(x);

const clampInt = (n, min, max, fallback) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, Math.round(v)));
};

const sanitizeRecord = (obj, { intMin, intMax }) => {
  if (!isPlainObject(obj)) return {};
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof k !== 'string' || !ID_RE.test(k)) continue;
    const n = clampInt(v, intMin, intMax, null);
    if (n !== null) out[k] = n;
  }
  return out;
};

const sanitizeSelectedIds = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.filter((id) => typeof id === 'string' && ID_RE.test(id));
};

/**
 * Read persisted app data from localStorage. Returns null if missing or invalid.
 */
export function loadPersistedState() {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.v !== VERSION) return null;

    const theme =
      data.theme === 'dark' || data.theme === 'light' ? data.theme : 'dark';

    const scriptMode =
      data.scriptMode === 'hiragana' ||
      data.scriptMode === 'katakana' ||
      data.scriptMode === 'numbers'
        ? data.scriptMode
        : 'hiragana';

    const sessionDuration = clampInt(data.sessionDuration, 0, 15, 0);

    return {
      theme,
      scriptMode,
      selectedIds: sanitizeSelectedIds(data.selectedIds),
      isSmartTraining:
        typeof data.isSmartTraining === 'boolean'
          ? data.isSmartTraining
          : true,
      isMultipleChoice:
        typeof data.isMultipleChoice === 'boolean'
          ? data.isMultipleChoice
          : false,
      multipleChoiceCount: [3, 4, 5, 6].includes(data.multipleChoiceCount)
        ? data.multipleChoiceCount
        : 3,
      mcRomajiPrompt:
        typeof data.mcRomajiPrompt === 'boolean' ? data.mcRomajiPrompt : false,
      showPrev:
        typeof data.showPrev === 'boolean' ? data.showPrev : false,
      showNext:
        typeof data.showNext === 'boolean' ? data.showNext : false,
      manualAnswerConfirm:
        typeof data.manualAnswerConfirm === 'boolean'
          ? data.manualAnswerConfirm
          : false,
      sessionDuration,
      weights: sanitizeRecord(data.weights, { intMin: 1, intMax: 4 }),
    };
  } catch {
    return null;
  }
}

function buildPayload(slice) {
  return {
    v: VERSION,
    theme: slice.theme,
    scriptMode: slice.scriptMode,
    selectedIds: slice.selectedIds,
    isSmartTraining: slice.isSmartTraining,
    isMultipleChoice: slice.isMultipleChoice,
    multipleChoiceCount: slice.multipleChoiceCount,
    mcRomajiPrompt: slice.mcRomajiPrompt,
    showPrev: slice.showPrev,
    showNext: slice.showNext,
    manualAnswerConfirm: slice.manualAnswerConfirm,
    sessionDuration: slice.sessionDuration,
    weights: slice.weights,
  };
}

export function savePersistedState(slice) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildPayload(slice)));
  } catch {
    // Quota, private mode, etc.
  }
}

/** Debounced save (avoids hammering storage during rapid updates). */
export function schedulePersist(slice) {
  if (typeof window === 'undefined') return;
  clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    persistTimer = null;
    savePersistedState(slice);
  }, 400);
}

/** Save a theme change without dropping the rest of the stored app data. */
export function persistTheme(theme) {
  const current = loadPersistedState();
  savePersistedState({
    theme,
    scriptMode: current?.scriptMode ?? 'hiragana',
    selectedIds: current?.selectedIds ?? [],
    isSmartTraining: current?.isSmartTraining ?? true,
    isMultipleChoice: current?.isMultipleChoice ?? false,
    multipleChoiceCount: [3, 4, 5, 6].includes(current?.multipleChoiceCount)
      ? current.multipleChoiceCount
      : 3,
    mcRomajiPrompt: current?.mcRomajiPrompt ?? false,
    showPrev: current?.showPrev ?? false,
    showNext: current?.showNext ?? false,
    manualAnswerConfirm: current?.manualAnswerConfirm ?? false,
    sessionDuration: current?.sessionDuration ?? 0,
    weights: current?.weights ?? {},
  });
}

/** Immediate save (tab background / unload). */
export function flushPersist(slice) {
  if (typeof window !== 'undefined') clearTimeout(persistTimer);
  persistTimer = null;
  savePersistedState(slice);
}
