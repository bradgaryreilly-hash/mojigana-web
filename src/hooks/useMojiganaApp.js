import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  KANA_DICT,
  NUM_DICT,
} from '../data/kanaData';
import { sanitizeQueue, generateChoices } from '../logic/quizFunctions';
import { getMedalDisplayInfo } from '../lib/medalDisplay';
import {
  loadPersistedState,
  schedulePersist,
  flushPersist,
} from '../lib/persistedState';

/** Space / NBSP / full-width space etc. — Android keyboards often differ from iOS. */
function isSingleWhitespaceConfirmChar(data) {
  if (data == null || data === '') return false;
  const chars = [...data];
  if (chars.length !== 1) return false;
  const c = chars[0];
  return /\s/u.test(c) && c !== '\n' && c !== '\r';
}

function isWhitespaceOnlyString(data) {
  return data != null && data !== '' && /^\s+$/u.test(data);
}

/** Samsung / Android soft keys often omit `e.key === ' '`. */
function isSpaceConfirmKeyEvent(e) {
  return (
    e.key === ' ' ||
    e.code === 'Space' ||
    e.key === 'Spacebar' ||
    e.keyCode === 32 ||
    e.which === 32
  );
}

function isEnterConfirmKeyEvent(e) {
  return (
    e.key === 'Enter' ||
    e.code === 'Enter' ||
    e.code === 'NumpadEnter' ||
    e.keyCode === 13 ||
    e.which === 13
  );
}

export const useMojiganaApp = () => {
  const persisted = useMemo(() => loadPersistedState(), []);

  const [currentView, setCurrentView] = useState('home');
  const [scriptMode, setScriptMode] = useState(
    () => persisted?.scriptMode ?? 'hiragana',
  );
  const [selectedIds, setSelectedIds] = useState(
    () => persisted?.selectedIds ?? [],
  );
  const [isSmartTraining, setIsSmartTraining] = useState(
    () => persisted?.isSmartTraining ?? true,
  );
  const [isMultipleChoice, setIsMultipleChoice] = useState(
    () => persisted?.isMultipleChoice ?? false,
  );
  const [showPrev, setShowPrev] = useState(() => persisted?.showPrev ?? true);
  const [showNext, setShowNext] = useState(() => persisted?.showNext ?? true);
  const [manualAnswerConfirm, setManualAnswerConfirm] = useState(
    () => persisted?.manualAnswerConfirm ?? false,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMasteryInfoOpen, setIsMasteryInfoOpen] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'none', direction: 'desc' });
  const [weights, setWeights] = useState(() => persisted?.weights ?? {});
  const [mastery, setMastery] = useState(() => persisted?.mastery ?? {});
  const [quizQueue, setQuizQueue] = useState([]);
  const [quizOptions, setQuizOptions] = useState([]);
  const [prevQuizItem, setPrevQuizItem] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [theme, setTheme] = useState(() => persisted?.theme ?? 'dark');
  const [sessionDuration, setSessionDuration] = useState(
    () => persisted?.sessionDuration ?? 0,
  );
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    wrong: 0,
    pointsChange: 0,
    charData: {},
    poolSnapshot: null,
  });

  const inputRef = useRef(null);
  /** Blocks duplicate submitTypedAnswer in one sync turn (keydown + input + keyup). */
  const syncSubmitGuardRef = useRef(false);
  /** Clears input after wrong flash; cancelled if user answers correctly during the flash. */
  const wrongFlashTimerRef = useRef(null);
  /** Session Hits/Miss (and session Pts) use only the first graded answer per card; reset on shiftQueue. */
  const sessionOutcomeCommittedRef = useRef(false);
  const timerRef = useRef(null);
  const persistSnapshotRef = useRef(null);
  const currentViewRef = useRef(currentView);
  const prevViewRef = useRef(null);
  const isDark = theme === 'dark';
  const currentQuizItem = quizQueue[0] || null;
  const nextQuizItem = quizQueue[1] || null;

  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);

  const clearWrongFlashTimer = useCallback(() => {
    if (wrongFlashTimerRef.current != null) {
      clearTimeout(wrongFlashTimerRef.current);
      wrongFlashTimerRef.current = null;
    }
  }, []);

  const clearQuizEphemeralState = useCallback(() => {
    clearWrongFlashTimer();
    sessionOutcomeCommittedRef.current = false;
    setSessionStats({
      correct: 0,
      wrong: 0,
      pointsChange: 0,
      charData: {},
      poolSnapshot: null,
    });
    setQuizQueue([]);
    setQuizOptions([]);
    setPrevQuizItem(null);
    setInputValue('');
    setIsCorrect(false);
    setIsWrong(false);
    setShowingAnswer(false);
    setIsPaused(false);
    setTimeLeft(0);
  }, [clearWrongFlashTimer]);

  /** Leaving quiz or results drops in-memory session data; nothing is restored next visit. */
  useEffect(() => {
    const prev = prevViewRef.current;
    if (
      prev !== null &&
      (prev === 'quiz' || prev === 'results') &&
      currentView !== 'quiz' &&
      currentView !== 'results'
    ) {
      clearQuizEphemeralState();
    }
    prevViewRef.current = currentView;
  }, [currentView, clearQuizEphemeralState]);

  /**
   * Lock document scroll on the quiz screen so the layout viewport does not move under
   * the shell. Quiz content scrolls inside QuizView instead (avoids iOS Safari fighting
   * visualViewport scroll handlers and leaving the header off-screen).
   * useLayoutEffect runs before paint with QuizView’s own layout reset so the first frame
   * is not scrolled down.
   */
  useLayoutEffect(() => {
    if (currentView !== 'quiz') return;

    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const pinDocumentTop = () => {
      const root = document.scrollingElement ?? html;
      window.scrollTo(0, 0);
      root.scrollTop = 0;
      html.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    pinDocumentTop();

    const onFocusIn = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        requestAnimationFrame(pinDocumentTop);
        requestAnimationFrame(() => requestAnimationFrame(pinDocumentTop));
      }
    };
    document.addEventListener('focusin', onFocusIn);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [currentView]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Sawarabi+Gothic&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const slice = {
      theme,
      scriptMode,
      selectedIds,
      isSmartTraining,
      isMultipleChoice,
      showPrev,
      showNext,
      manualAnswerConfirm,
      sessionDuration,
      mastery,
      weights,
    };
    persistSnapshotRef.current = slice;
    if (currentView !== 'quiz') {
      schedulePersist(slice);
    }
  }, [
    currentView,
    theme,
    scriptMode,
    selectedIds,
    isSmartTraining,
    isMultipleChoice,
    showPrev,
    showNext,
    manualAnswerConfirm,
    sessionDuration,
    mastery,
    weights,
  ]);

  useEffect(() => {
    const saveNow = () => {
      if (currentViewRef.current === 'quiz') return;
      if (persistSnapshotRef.current) flushPersist(persistSnapshotRef.current);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') saveNow();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', saveNow);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', saveNow);
    };
  }, []);

  useEffect(() => {
    if (currentView === 'quiz' && sessionDuration > 0 && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCurrentView('results');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [currentView, sessionDuration, isPaused]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const getId = (key) => {
    const prefix =
      scriptMode === 'hiragana' ? 'h' : scriptMode === 'katakana' ? 'k' : 'n';
    return `${prefix}_${key}`;
  };

  const toggleKana = (key) => {
    if (!key) return;
    const id = getId(key);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleMedalGroup = (medalName) => {
    const allKeys =
      scriptMode === 'numbers' ? Object.keys(NUM_DICT) : Object.keys(KANA_DICT);
    const targetIds = allKeys
      .map((k) => getId(k))
      .filter(
        (id) => getMedalDisplayInfo(mastery[id] || 0, isDark).name === medalName,
      );
    if (targetIds.length === 0) return;
    const allCurrentlySelected = targetIds.every((id) =>
      selectedIds.includes(id),
    );
    setSelectedIds((prev) =>
      allCurrentlySelected
        ? prev.filter((id) => !targetIds.includes(id))
        : [...new Set([...prev, ...targetIds])],
    );
  };

  const toggleRow = (rowIndex, layout) => {
    const rowKeys = layout[rowIndex].filter((r) => r !== null);
    const rowIds = rowKeys.map((r) => getId(r));
    const allSelected = rowIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !rowIds.includes(id))
        : [...new Set([...prev, ...rowIds])],
    );
  };

  const toggleCol = (colIndex, layout) => {
    const colKeys = layout.map((row) => row[colIndex]).filter((r) => r !== null);
    const colIds = colKeys.map((r) => getId(r));
    const allSelected = colIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !colIds.includes(id))
        : [...new Set([...prev, ...colIds])],
    );
  };

  const toggleAllInLayout = (layout) => {
    const layoutKeys = layout.flat().filter((r) => r !== null);
    const layoutIds = layoutKeys.map((r) => getId(r));
    const allSelected = layoutIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !layoutIds.includes(id))
        : [...new Set([...prev, ...layoutIds])],
    );
  };

  const getPool = useCallback(
    () =>
      selectedIds.map((id) => {
        const [typePrefix, key] = id.split('_');
        if (typePrefix === 'n') {
          const item = NUM_DICT[key];
          return {
            id,
            romaji: item.romaji,
            digit: key,
            char: item.char,
            type: 'numbers',
            aliases: [key, ...(item.aliases || [])],
          };
        }
        const item = KANA_DICT[key];
        const char = typePrefix === 'h' ? item.h : item.k;
        return {
          id,
          romaji: key,
          char,
          type: typePrefix === 'h' ? 'hiragana' : 'katakana',
          aliases: item.aliases || [],
        };
      }),
    [selectedIds],
  );

  const generateBatch = (currentWeights) => {
    const pool = getPool();
    const batch = [];
    pool.forEach((item) => {
      const freq = isSmartTraining ? currentWeights[item.id] || 1 : 1;
      for (let i = 0; i < freq; i++) batch.push({ ...item });
    });
    for (let i = batch.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [batch[i], batch[j]] = [batch[j], batch[i]];
    }
    return batch;
  };

  const startQuiz = () => {
    if (selectedIds.length === 0) return;
    clearWrongFlashTimer();
    sessionOutcomeCommittedRef.current = false;
    const pool = getPool();
    /**
     * Session = one run from Start Quiz until you leave quiz or results.
     * poolSnapshot freezes which characters belonged to this run so Session Stats
     * cannot drift from live getPool() (e.g. selection/script changes elsewhere).
     */
    setSessionStats({
      correct: 0,
      wrong: 0,
      pointsChange: 0,
      charData: {},
      poolSnapshot: pool.map((p) => ({ ...p })),
    });
    setTimeLeft(sessionDuration * 60);
    setIsPaused(false);
    setCurrentView('quiz');
    const initialBatch = generateBatch(weights);
    let queue =
      initialBatch.length < 5
        ? [...initialBatch, ...generateBatch(weights)]
        : initialBatch;
    const finalQueue = sanitizeQueue(queue);
    setQuizQueue(finalQueue);
    setQuizOptions(generateChoices(finalQueue[0]));
    setPrevQuizItem(null);
    setInputValue('');
  };

  const shiftQueue = () => {
    clearWrongFlashTimer();
    sessionOutcomeCommittedRef.current = false;
    setQuizQueue((prevQueue) => {
      const newQ = [...prevQueue];
      const finishedItem = newQ.shift();
      setPrevQuizItem(finishedItem);
      if (newQ.length <= Math.max(5, getPool().length)) {
        newQ.push(...generateBatch(weights));
      }
      const sanitized = sanitizeQueue(newQ);
      setQuizOptions(generateChoices(sanitized[0]));
      return sanitized;
    });
    setInputValue('');
    setIsCorrect(false);
    setIsWrong(false);
    setShowingAnswer(false);
  };

  /** Full-string check: multiple-choice picks, manual typing (Enter / Space), and wrong answers that are not valid prefixes. */
  const submitTypedAnswer = (raw) => {
    if (isCorrect || isPaused || !currentQuizItem) return;
    const val = raw.toLowerCase().trim();
    if (val.length === 0) return;

    const allPossible = [
      currentQuizItem.romaji,
      ...(currentQuizItem.aliases || []),
    ];

    if (isWrong) {
      if (!allPossible.includes(val)) return;
      /* Correct recovery: advance card; session hit was already decided on first answer. */
    }

    if (syncSubmitGuardRef.current) return;
    syncSubmitGuardRef.current = true;
    queueMicrotask(() => {
      syncSubmitGuardRef.current = false;
    });

    const charId = currentQuizItem.id;
    const isEligibleForMastery = selectedIds.length >= 5;

    if (allPossible.includes(val)) {
      clearWrongFlashTimer();
      setIsWrong(false);
      if (!sessionOutcomeCommittedRef.current) {
        sessionOutcomeCommittedRef.current = true;
        setSessionStats((prev) => {
          const charData = { ...prev.charData };
          if (!charData[charId]) {
            charData[charId] = { correct: 0, wrong: 0, sessionPoints: 0 };
          }
          charData[charId].correct += 1;
          if (isEligibleForMastery) charData[charId].sessionPoints += 1;
          return {
            ...prev,
            correct: prev.correct + 1,
            pointsChange:
              prev.pointsChange + (isEligibleForMastery ? 1 : 0),
            charData,
          };
        });
      }
      if (isEligibleForMastery) {
        setWeights((prev) => ({
          ...prev,
          [charId]: Math.max(1, (prev[charId] || 1) - 1),
        }));
        setMastery((prev) => ({
          ...prev,
          [charId]: (prev[charId] || 0) + 1,
        }));
      }
      setIsCorrect(true);
      setTimeout(() => {
        shiftQueue();
      }, 150);
    } else {
      if (isWrong) return;
      const oldScore = mastery[charId] || 0;
      const rank = getMedalDisplayInfo(oldScore, isDark);
      const actualPenalty = Math.min(rank.penalty, oldScore);
      if (!sessionOutcomeCommittedRef.current) {
        sessionOutcomeCommittedRef.current = true;
        setSessionStats((prev) => {
          const charData = { ...prev.charData };
          if (!charData[charId]) {
            charData[charId] = { correct: 0, wrong: 0, sessionPoints: 0 };
          }
          charData[charId].wrong += 1;
          if (isEligibleForMastery) {
            charData[charId].sessionPoints -= actualPenalty;
          }
          return {
            ...prev,
            wrong: prev.wrong + 1,
            pointsChange:
              prev.pointsChange - (isEligibleForMastery ? actualPenalty : 0),
            charData,
          };
        });
        if (isEligibleForMastery) {
          setWeights((prev) => ({
            ...prev,
            [charId]: Math.min(4, (prev[charId] || 1) + 1),
          }));
          setMastery((prev) => ({
            ...prev,
            [charId]: Math.max(0, oldScore - actualPenalty),
          }));
        }
      }
      setQuizQueue((prevQueue) => {
        const newQ = [...prevQueue];
        const currentInstances = newQ.filter((item) => item.id === charId).length;
        if (currentInstances < 3) {
          const jump = Math.floor(Math.random() * 3) + 3;
          newQ.splice(Math.min(jump, newQ.length), 0, currentQuizItem);
        }
        return sanitizeQueue(newQ);
      });
      setIsWrong(true);
      clearWrongFlashTimer();
      wrongFlashTimerRef.current = setTimeout(() => {
        wrongFlashTimerRef.current = null;
        setInputValue('');
        setIsWrong(false);
      }, 350);
    }
  };

  const handleInputChange = (e) => {
    if (isCorrect || isPaused) return;
    const raw = e.target.value;

    if (isMultipleChoice) {
      setInputValue(raw);
      submitTypedAnswer(raw);
      return;
    }

    if (manualAnswerConfirm) {
      const prev = inputValue;
      if (raw.startsWith(prev) && raw.length > prev.length) {
        const suffix = raw.slice(prev.length);
        if (isWhitespaceOnlyString(suffix)) {
          submitTypedAnswer(prev);
          return;
        }
      }
      setInputValue(raw);
      return;
    }

    const val = raw.toLowerCase().trim();
    setInputValue(raw);
    if (!currentQuizItem) return;
    const allPossible = [
      currentQuizItem.romaji,
      ...(currentQuizItem.aliases || []),
    ];

    if (allPossible.includes(val)) {
      submitTypedAnswer(raw);
    } else if (
      val.length > 0 &&
      !allPossible.some((answer) => answer.startsWith(val))
    ) {
      submitTypedAnswer(raw);
    }
  };

  const handleQuizInputKeyDown = (e) => {
    if (
      !manualAnswerConfirm ||
      isMultipleChoice ||
      isCorrect ||
      isPaused
    ) {
      return;
    }
    if (isSpaceConfirmKeyEvent(e) || isEnterConfirmKeyEvent(e)) {
      e.preventDefault();
      let v = e.currentTarget.value;
      if (isEnterConfirmKeyEvent(e)) v = v.replace(/\r?\n$/u, '');
      submitTypedAnswer(v);
    }
  };

  /**
   * Some Samsung / Android builds fire keyup when keydown/beforeinput are missing or mis-labeled.
   * Runs after the character is in the field, so trim trailing whitespace for Space.
   */
  const handleQuizInputKeyUp = (e) => {
    if (
      !manualAnswerConfirm ||
      isMultipleChoice ||
      isCorrect ||
      isPaused
    ) {
      return;
    }
    if (isSpaceConfirmKeyEvent(e)) {
      const el = e.currentTarget;
      const raw = el.value;
      const base = raw.replace(/\s+$/u, '');
      if (base.length < raw.length) submitTypedAnswer(base);
      return;
    }
    if (isEnterConfirmKeyEvent(e)) {
      submitTypedAnswer(e.currentTarget.value.replace(/\r?\n$/u, ''));
    }
  };

  /**
   * Mobile keyboards often skip keydown for Space/Enter; beforeinput still fires.
   * Space: insertText with data " " — prevent so the field does not gain a space.
   */
  const handleQuizInputBeforeInput = (e) => {
    if (
      !manualAnswerConfirm ||
      isMultipleChoice ||
      isCorrect ||
      isPaused
    ) {
      return;
    }
    const ni = e.nativeEvent;
    if (!ni || typeof ni.inputType !== 'string') return;

    if (ni.inputType === 'insertText' && isSingleWhitespaceConfirmChar(ni.data)) {
      e.preventDefault();
      submitTypedAnswer(e.currentTarget.value);
      return;
    }
    if (
      (ni.inputType === 'insertReplacementText' ||
        ni.inputType === 'insertCompositionText') &&
      isWhitespaceOnlyString(ni.data)
    ) {
      e.preventDefault();
      submitTypedAnswer(e.currentTarget.value);
      return;
    }
    if (ni.inputType === 'insertLineBreak' || ni.inputType === 'insertParagraph') {
      e.preventDefault();
      submitTypedAnswer(e.currentTarget.value);
    }
  };

  return {
    currentView,
    setCurrentView,
    scriptMode,
    setScriptMode,
    selectedIds,
    setSelectedIds,
    isSmartTraining,
    setIsSmartTraining,
    isMultipleChoice,
    setIsMultipleChoice,
    showPrev,
    setShowPrev,
    showNext,
    setShowNext,
    manualAnswerConfirm,
    setManualAnswerConfirm,
    isSettingsOpen,
    setIsSettingsOpen,
    isMasteryInfoOpen,
    setIsMasteryInfoOpen,
    infoModal,
    setInfoModal,
    sortConfig,
    setSortConfig,
    mastery,
    sessionDuration,
    setSessionDuration,
    timeLeft,
    sessionStats,
    inputRef,
    isDark,
    currentQuizItem,
    nextQuizItem,
    prevQuizItem,
    inputValue,
    isCorrect,
    isWrong,
    isFocused,
    setIsFocused,
    isPaused,
    setIsPaused,
    showingAnswer,
    setShowingAnswer,
    quizOptions,
    toggleTheme,
    getId,
    toggleKana,
    toggleMedalGroup,
    toggleRow,
    toggleCol,
    toggleAllInLayout,
    getPool,
    startQuiz,
    handleInputChange,
    handleQuizInputKeyDown,
    handleQuizInputKeyUp,
    handleQuizInputBeforeInput,
  };
};
