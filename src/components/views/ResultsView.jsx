import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';

const SortHeaderButton = ({ label, sortKey, align = 'end', sortConfig, onSort }) => (
  <button
    type="button"
    onClick={() => onSort(sortKey)}
    className={`flex items-center gap-1 hover:opacity-100 transition-opacity ${
      sortConfig.key === sortKey ? 'opacity-100' : 'opacity-40'
    } ${align === 'end' ? 'justify-end' : 'justify-start'} text-slate-400`}
  >
    <span className="text-[8px] font-black uppercase tracking-widest">
      {label}
    </span>
    <span className="flex flex-col -gap-1">
      <ArrowUpDown size={8} />
    </span>
  </button>
);

const ResultsView = ({
  isDark,
  sessionStats,
  mastery,
  getPool,
  sortConfig,
  setSortConfig,
  setCurrentView,
}) => {
  const total = sessionStats.correct + sessionStats.wrong;
  const accuracy =
    total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;
  const pool = getPool();
  const sortedSummaryPool = [...pool].sort(
    (a, b) => (mastery[b.id] || 0) - (mastery[a.id] || 0),
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const sortedList = [...pool].sort((a, b) => {
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
      valA = statsA.correct;
      valB = statsB.correct;
    } else if (sortConfig.key === 'wrong') {
      valA = statsA.wrong;
      valB = statsB.wrong;
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
                {sessionStats.correct}
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
                {sessionStats.wrong}
              </span>
            </div>
          </div>
        </div>

        {total > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-[2rem] border flex flex-col items-center ${
                isDark
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-emerald-50 border-emerald-100'
              }`}
            >
              <TrendingUp size={14} className="text-[#06948E] mb-1" />
              <span
                className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
                style={{ fontFamily: "'Sawarabi Gothic', sans-serif" }}
              >
                {sortedSummaryPool[0]?.char}
              </span>
              <span className="text-[8px] font-black uppercase text-[#06948E]">
                Strongest
              </span>
            </div>
            <div
              className={`p-3 rounded-[2.5rem] border flex flex-col items-center ${
                isDark
                  ? 'bg-rose-500/5 border-rose-500/20'
                  : 'bg-rose-50 border-rose-100'
              }`}
            >
              <TrendingDown size={14} className="text-rose-500 mb-1" />
              <span
                className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
                style={{ fontFamily: "'Sawarabi Gothic', sans-serif" }}
              >
                {sortedSummaryPool[sortedSummaryPool.length - 1]?.char}
              </span>
              <span className="text-[8px] font-black uppercase text-rose-600">
                Needs Focus
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Details
            </h4>
            <div className="flex gap-4 pr-2">
              <SortHeaderButton
                label="Hits"
                sortKey="correct"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortHeaderButton
                label="Miss"
                sortKey="wrong"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortHeaderButton
                label="Pts"
                sortKey="points"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </div>
          </div>
          <div className="space-y-1">
            {sortedList.map((item) => {
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
                  <span
                    style={{ fontFamily: "'Sawarabi Gothic', sans-serif" }}
                    className={`text-xl font-bold w-16 whitespace-nowrap ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.char}
                  </span>
                  <div className="flex-1 flex items-center justify-end gap-6 text-sm font-black">
                    <span className="text-[#06948E] w-8 text-right">
                      {s.correct}
                    </span>
                    <span className="text-rose-500 w-8 text-right">
                      {s.wrong}
                    </span>
                    <span className="text-blue-500 w-10 text-right">
                      {s.sessionPoints > 0
                        ? `+${s.sessionPoints}`
                        : s.sessionPoints}
                    </span>
                  </div>
                </div>
              );
            })}
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
