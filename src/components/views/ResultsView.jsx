import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';

/** Hit/miss counts must be plain non-negative integers (ignores booleans, strings, floats). */
const sessionCount = (v) => {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 0) return 0;
  return v;
};

/** True if this character has at least one submitted answer (hit or miss) this run. */
const wasAnsweredThisSession = (charData, itemId) => {
  const s = charData[itemId];
  if (!s) return false;
  return sessionCount(s.correct) + sessionCount(s.wrong) > 0;
};

/**
 * Strongest / weakest from rows for characters the user actually answered (same as details grid).
 * Weakest exists only if sum of misses across those rows is > 0.
 */
const pickSessionStrongestWeakest = (rows) => {
  if (rows.length === 0) {
    return { strongestSessionItem: null, weakestSessionItem: null };
  }

  const wrongN = rows.reduce((acc, r) => acc + r.wrong, 0);
  const correctN = rows.reduce((acc, r) => acc + r.correct, 0);

  let weakestSessionItem = null;
  if (wrongN > 0) {
    const maxWrong = Math.max(...rows.map((r) => r.wrong));
    if (maxWrong > 0) {
      const byWrong = rows.filter((r) => r.wrong === maxWrong);
      const minCorrect = Math.min(...byWrong.map((r) => r.correct));
      const tied = byWrong.filter((r) => r.correct === minCorrect);
      weakestSessionItem = tied[Math.floor(Math.random() * tied.length)].item;
    }
  }

  let strongestSessionItem = null;
  if (correctN > 0) {
    const maxCorrect = Math.max(...rows.map((r) => r.correct));
    const byCorrect = rows.filter((r) => r.correct === maxCorrect);
    const minWrong = Math.min(...byCorrect.map((r) => r.wrong));
    const tied = byCorrect.filter((r) => r.wrong === minWrong);
    strongestSessionItem = tied[Math.floor(Math.random() * tied.length)].item;
  }

  return { strongestSessionItem, weakestSessionItem };
};

const SortHeaderButton = ({ label, sortKey, sortConfig, onSort, colClassName }) => (
  <button
    type="button"
    onClick={() => onSort(sortKey)}
    className={`flex flex-col items-end gap-0.5 shrink-0 text-right hover:opacity-100 transition-opacity ${
      sortConfig.key === sortKey ? 'opacity-100' : 'opacity-40'
    } text-slate-400 ${colClassName ?? ''}`}
  >
    <span className="text-[8px] font-black uppercase tracking-widest leading-none">
      {label}
    </span>
    <ArrowUpDown size={8} className="shrink-0" aria-hidden />
  </button>
);

const ResultsView = ({
  isDark,
  sessionStats,
  getPool,
  sortConfig,
  setSortConfig,
  setCurrentView,
}) => {
  const pool =
    Array.isArray(sessionStats.poolSnapshot) && sessionStats.poolSnapshot.length > 0
      ? sessionStats.poolSnapshot
      : getPool();
  const answeredPool = pool.filter((item) =>
    wasAnsweredThisSession(sessionStats.charData, item.id),
  );
  const sessionRows = answeredPool.map((item) => {
    const s = sessionStats.charData[item.id] || {};
    return {
      item,
      correct: sessionCount(s.correct),
      wrong: sessionCount(s.wrong),
    };
  });
  const correctN = sessionRows.reduce((acc, r) => acc + r.correct, 0);
  const wrongN = sessionRows.reduce((acc, r) => acc + r.wrong, 0);
  const total = correctN + wrongN;
  const accuracy = total > 0 ? Math.round((correctN / total) * 100) : 0;
  const { strongestSessionItem, weakestSessionItem } =
    pickSessionStrongestWeakest(sessionRows);
  const showStrongestCard = strongestSessionItem != null;
  const showFilledWeakest = weakestSessionItem != null && wrongN > 0;
  const showEmptyWeakest =
    wrongN === 0 && total > 0 && showStrongestCard;
  const showNeedsFocusSlot = showFilledWeakest || showEmptyWeakest;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const sortedList = [...answeredPool].sort((a, b) => {
    if (sortConfig.key === 'none') return 0;
    const statsA = sessionStats.charData[a.id] || {
      correct: 0,
      wrong: 0,
      sessionPoints: 0,
    };
    const statsB = sessionStats.charData[b.id] || {
      correct: 0,
      wrong: 0,
      sessionPoints: 0,
    };
    let valA;
    let valB;
    if (sortConfig.key === 'correct') {
      valA = sessionCount(statsA.correct);
      valB = sessionCount(statsB.correct);
    } else if (sortConfig.key === 'wrong') {
      valA = sessionCount(statsA.wrong);
      valB = sessionCount(statsB.wrong);
    } else {
      valA = statsA.sessionPoints;
      valB = statsB.sessionPoints;
    }
    return sortConfig.direction === 'desc' ? valB - valA : valA - valB;
  });

  return (
    <div
      className={`flex flex-col h-full overflow-y-scroll ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      <header className="px-4 h-14 border-b flex items-center justify-center sticky top-0 bg-inherit z-10">
        <h2
          className={`text-lg font-bold uppercase tracking-widest ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}
        >
          Session Stats
        </h2>
      </header>
      <p
        className={`px-5 text-center text-[10px] leading-snug ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}
      >
        Session means this quiz run only—from Start Quiz until you leave the quiz or
        this screen. It is not saved when you exit. Each card counts once: your first
        graded answer on that card is its hit or miss; fixing a wrong answer still
        leaves a miss and does not add a hit. Details and strongest/weakest use only
        characters you answered at least once (e.g. unseen cards in a short run are
        omitted).
      </p>
      <div className="flex-1 p-5 space-y-5">
        <div className="flex items-center justify-between gap-6 px-4">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="transparent"
                stroke={isDark ? '#1e293b' : '#f1f5f9'}
                strokeWidth="6"
              />
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="transparent"
                stroke="#06948E"
                strokeWidth="6"
                strokeDasharray="263.8"
                strokeDashoffset={263.8 - (accuracy / 100) * 263.8}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-black text-[#06948E]">
                {accuracy}%
              </span>
              <span className="text-[8px] font-black uppercase text-slate-400">
                Score
              </span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div
              className={`p-3 rounded-2xl border ${
                isDark
                  ? 'bg-slate-800/40 border-slate-700'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">
                Total
              </span>
              <span
                className={`text-lg font-black ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {total}
              </span>
            </div>
            <div
              className={`p-3 rounded-2xl border ${
                isDark
                  ? 'bg-slate-800/40 border-slate-700'
                  : 'bg-emerald-50 border-emerald-100'
              }`}
            >
              <span className="text-[8px] font-black uppercase text-[#06948E] block mb-1">
                Hits
              </span>
              <span className="text-lg font-black text-[#06948E]">
                {correctN}
              </span>
            </div>
            <div
              className={`p-3 rounded-2xl border ${
                isDark
                  ? 'bg-slate-800/40 border-slate-700'
                  : 'bg-rose-50 border-rose-100'
              }`}
            >
              <span className="text-[8px] font-black uppercase text-rose-500 block mb-1">
                Miss
              </span>
              <span className="text-lg font-black text-rose-500">
                {wrongN}
              </span>
            </div>
          </div>
        </div>

        {total > 0 && (showStrongestCard || showFilledWeakest) && (
          <div
            className={`grid gap-3 ${
              showStrongestCard && showNeedsFocusSlot
                ? 'grid-cols-2'
                : 'grid-cols-1'
            }`}
          >
            {showStrongestCard && (
              <div
                className={`p-3 rounded-[2rem] border flex flex-col items-center ${
                  isDark
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-emerald-50 border-emerald-100'
                }`}
              >
                <TrendingUp size={14} className="text-[#06948E] mb-1" />
                <span
                  className={`text-2xl font-bold whitespace-nowrap break-keep ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                  style={{ fontFamily: "'Sawarabi Gothic', sans-serif" }}
                >
                  {strongestSessionItem.char}
                </span>
                <span className="text-[8px] font-black uppercase text-[#06948E]">
                  Strongest
                </span>
              </div>
            )}
            {showNeedsFocusSlot && (
              <div
                className={`p-3 rounded-[2.5rem] border flex flex-col items-center ${
                  isDark
                    ? 'bg-rose-500/5 border-rose-500/20'
                    : 'bg-rose-50 border-rose-100'
                }`}
                aria-label={
                  showEmptyWeakest
                    ? 'Needs focus: no misses this session'
                    : undefined
                }
              >
                <TrendingDown size={14} className="text-rose-500 mb-1" />
                <span
                  className={`flex min-h-[2.25rem] w-full items-center justify-center text-2xl font-bold whitespace-nowrap break-keep ${
                    showFilledWeakest
                      ? isDark
                        ? 'text-white'
                        : 'text-slate-900'
                      : 'text-transparent select-none'
                  }`}
                  style={{ fontFamily: "'Sawarabi Gothic', sans-serif" }}
                >
                  {showFilledWeakest ? weakestSessionItem.char : '\u00a0'}
                </span>
                <span className="text-[8px] font-black uppercase text-rose-600">
                  Needs Focus
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-4 px-4">
            <div className="flex min-w-0 max-w-[55%] flex-1">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Details
              </h4>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-4 sm:gap-6">
              <SortHeaderButton
                label="Hits"
                sortKey="correct"
                sortConfig={sortConfig}
                onSort={handleSort}
                colClassName="w-8"
              />
              <SortHeaderButton
                label="Miss"
                sortKey="wrong"
                sortConfig={sortConfig}
                onSort={handleSort}
                colClassName="w-8"
              />
              <SortHeaderButton
                label="Pts"
                sortKey="points"
                sortConfig={sortConfig}
                onSort={handleSort}
                colClassName="w-10"
              />
            </div>
          </div>
          <div className="space-y-1">
            {sortedList.length === 0 ? (
              <p
                className={`text-center text-xs py-6 px-4 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                No answers recorded this run—stats appear here once you respond to at
                least one card.
              </p>
            ) : (
              sortedList.map((item) => {
                const s = sessionStats.charData[item.id] || {
                  correct: 0,
                  wrong: 0,
                  sessionPoints: 0,
                };
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-2 px-4 rounded-xl border ${
                      isDark
                        ? 'bg-slate-800/30 border-slate-700'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex min-w-0 max-w-[55%] flex-1 items-center gap-2 sm:gap-3">
                      <span
                        style={{ fontFamily: "'Sawarabi Gothic', sans-serif" }}
                        className={`shrink-0 text-xl font-bold whitespace-nowrap break-keep ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.char}
                      </span>
                      <span
                        className={`truncate text-left text-[11px] font-black uppercase tracking-wide ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                        title={item.romaji ?? ''}
                      >
                        {item.romaji ?? ''}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center justify-end gap-4 text-sm font-black sm:gap-6">
                      <span className="inline-block w-8 text-right tabular-nums text-[#06948E]">
                        {sessionCount(s.correct)}
                      </span>
                      <span className="inline-block w-8 text-right tabular-nums text-rose-500">
                        {sessionCount(s.wrong)}
                      </span>
                      <span className="inline-block w-10 text-right tabular-nums text-blue-500">
                        {s.sessionPoints > 0
                          ? `+${s.sessionPoints}`
                          : s.sessionPoints}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <div className="p-5 sticky bottom-0 bg-inherit border-t border-transparent">
        <button
          type="button"
          onClick={() => {
            setCurrentView('selection');
            setSortConfig({ key: 'none', direction: 'desc' });
          }}
          className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl ${
            isDark
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 shadow-emerald-500/20'
              : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-cyan-600/30'
          }`}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
