import { useMemo } from 'react';
import {
  ChevronLeft,
  Settings,
  Sun,
  Moon,
  RotateCcw,
  Plus,
  Minus,
  Info,
} from 'lucide-react';
import {
  KANA_DICT,
  NUM_DICT,
  BASIC_GRID,
  DAKUON_GRID,
  COMBO_GRID,
  NUM_LAYOUT,
} from '../../data/kanaData';
import { getMedalDisplayInfo } from '../../lib/medalDisplay';

const SelectionView = ({
  isDark,
  scriptMode,
  setScriptMode,
  selectedIds,
  setSelectedIds,
  mastery,
  sessionDuration,
  setSessionDuration,
  setCurrentView,
  toggleTheme,
  setIsSettingsOpen,
  setIsMasteryInfoOpen,
  startQuiz,
  getId,
  toggleKana,
  toggleMedalGroup,
  toggleRow,
  toggleCol,
  toggleAllInLayout,
}) => {
  const selectionCountByMode = useMemo(() => {
    let hiragana = 0;
    let katakana = 0;
    let numbers = 0;
    for (const id of selectedIds) {
      if (id.startsWith('h_')) hiragana += 1;
      else if (id.startsWith('k_')) katakana += 1;
      else if (id.startsWith('n_')) numbers += 1;
    }
    return { hiragana, katakana, numbers };
  }, [selectedIds]);

  const helperBtnClass = `aspect-square w-full flex items-center justify-center rounded-xl font-bold text-xs shadow-sm active:scale-90 transition-all ${
    isDark
      ? 'bg-slate-800 border border-slate-700 text-slate-300'
      : 'bg-white border border-slate-200 text-slate-400'
  }`;

  const renderKanaButton = (key, type) => {
    if (!key) return null;
    const id = getId(key);
    const isSelected = selectedIds.includes(id);
    const item = type === 'numbers' ? NUM_DICT[key] : KANA_DICT[key];
    const char =
      type === 'numbers' ? item.char : scriptMode === 'katakana' ? item.k : item.h;
    const isMultiGlyphChar = char.length > 1;
    const info = getMedalDisplayInfo(mastery[id] || 0, isDark);

    return (
      <button
        key={id}
        type="button"
        onClick={() => toggleKana(key)}
        style={{
          background: isSelected ? info.bg : info.unselectedBg,
          borderColor: isSelected ? info.border : info.dimColor,
          borderWidth: '2px',
          boxShadow: isSelected ? `0 0 15px ${info.color}44` : 'none',
          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
          fontSize: 'clamp(0.6rem, min(1.8vw, 2.4vmin), 1.1rem)',
        }}
        className={`aspect-square w-full flex flex-col items-center justify-between rounded-xl transition-all relative p-1 sm:p-1.5 ${
          isSelected ? 'z-10 shadow-lg' : ''
        }`}
      >
        {info.icon && (
          <div className="absolute top-[5%] right-[5%] w-[20%] h-[20%]">
            <info.icon
              size="100%"
              style={{ color: info.color }}
              fill={info.color}
            />
          </div>
        )}
        <div className="flex-1 flex items-center justify-center w-full min-h-0 overflow-hidden mt-[5%]">
          <span
            style={{
              fontFamily: "'Sawarabi Gothic', sans-serif",
              wordBreak: 'keep-all',
            }}
            className={`font-bold leading-none transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${
              isMultiGlyphChar ? 'text-[1.35em]' : 'text-[1.8em]'
            } ${
              isDark
                ? isSelected
                  ? 'text-white'
                  : 'text-slate-100'
                : 'text-[#0f172a]'
            }`}
          >
            {char}
          </span>
        </div>
        <div
          className={`flex flex-col items-center leading-[1] shrink-0 transition-colors text-[0.7em] mb-[5%] ${
            isSelected
              ? isDark
                ? 'text-white'
                : 'text-slate-900'
              : 'text-slate-500'
          }`}
        >
          <span className="uppercase font-black">{key}</span>
          {type === 'numbers' && (
            <span className="uppercase font-black opacity-80 mt-[1%]">
              {item.romaji}
            </span>
          )}
        </div>
      </button>
    );
  };

  const renderGridSection = (layout, headers) => (
    <div
      className={`rounded-[2rem] p-3 mb-6 w-full max-w-xl mx-auto ${
        isDark ? 'bg-slate-800/40' : 'bg-slate-100/40'
      }`}
    >
      <div className="grid grid-cols-6 gap-1 mb-1">
        <button
          type="button"
          onClick={() => toggleAllInLayout(layout)}
          className={helperBtnClass}
        >
          ALL
        </button>
        {headers.length > 0
          ? headers.map((v, ci) => (
              <button
                key={ci}
                type="button"
                onClick={() => toggleCol(ci, layout)}
                className={helperBtnClass}
              >
                {v}
              </button>
            ))
          : Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="aspect-square" />
              ))}
      </div>
      {layout.map((row, ri) => (
        <div key={ri} className="grid grid-cols-6 gap-1 mb-1">
          <button
            type="button"
            onClick={() => toggleRow(ri, layout)}
            className={helperBtnClass}
          >
            {scriptMode === 'numbers'
              ? ri === 0
                ? '1-5'
                : ri === 1
                  ? '6-10'
                  : '100+'
              : layout === COMBO_GRID
                ? ['K', 'S', 'C', 'N', 'H', 'M', 'R', 'G', 'J', 'B', 'P'][ri]
                : layout === DAKUON_GRID
                  ? ['G', 'Z', 'D', 'B', 'P'][ri]
                  : [
                      'Ø',
                      'K',
                      'S',
                      'T',
                      'N',
                      'H',
                      'M',
                      'Y',
                      'R',
                      'W',
                      'N',
                    ][ri]}
          </button>
          {row.map((k, ki) =>
            k ? (
              renderKanaButton(k, scriptMode)
            ) : (
              <div
                key={`empty-${ri}-${ki}`}
                className={`aspect-square w-full rounded-lg ${
                  isDark ? 'bg-slate-800/10' : 'bg-slate-200/10'
                }`}
              />
            ),
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`flex flex-col h-full relative ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      <header
        className={`px-4 h-14 border-b flex items-center justify-between shrink-0 sticky top-0 z-20 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`}
      >
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-400 transition-all active:scale-95"
        >
          <ChevronLeft size={24} strokeWidth={2.25} />
        </button>
        <h2
          className={`text-lg font-bold tracking-tight absolute left-1/2 -translate-x-1/2 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}
        >
          Character Selection
        </h2>
        <div className="z-10 flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95 ${
              isDark ? 'text-amber-500' : 'text-black'
            }`}
          >
            {isDark ? <Sun size={22} strokeWidth={2.25} /> : <Moon size={22} strokeWidth={2.25} />}
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition-all active:scale-95"
          >
            <Settings size={22} strokeWidth={2.25} />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-scroll pb-32 px-4 pt-6 space-y-4">
        <div
          className={`w-full max-w-xl mx-auto border-2 rounded-[2.5rem] p-4 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
          }`}
        >
          <div
            className={`flex gap-1 rounded-3xl p-1 ${
              isDark ? 'bg-slate-900/60' : 'bg-slate-200/40'
            }`}
          >
            {['hiragana', 'katakana', 'numbers'].map((m) => {
              const count = selectionCountByMode[m];
              const active = scriptMode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setScriptMode(m)}
                  className={`relative flex min-h-8 flex-1 items-center justify-center rounded-xl py-2 text-xs font-bold uppercase transition-all ${
                    active
                      ? isDark
                        ? 'bg-slate-700 text-white shadow-md'
                        : 'bg-white text-slate-800 shadow-md'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {count > 0 && (
                    <span
                      className="pointer-events-none absolute left-2 top-1/2 z-10 flex h-[1.25rem] min-w-[1.25rem] -translate-y-1/2 items-center justify-center rounded-full bg-[#06948E] px-1.5 text-[10px] font-black leading-none text-white shadow-sm ring-1 ring-black/10 tabular-nums dark:ring-white/20"
                      aria-hidden
                    >
                      {count}
                    </span>
                  )}
                  <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center">
                    {m}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="grid grid-cols-6 gap-1.5"
            style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.95rem)' }}
          >
            {['Unranked', 'Bronze', 'Silver', 'Gold', 'Platinum'].map((name) => {
              const info = getMedalDisplayInfo(
                name === 'Platinum'
                  ? 30
                  : name === 'Gold'
                    ? 20
                    : name === 'Silver'
                      ? 10
                      : name === 'Bronze'
                        ? 4
                        : 0,
                isDark,
              );
              const isActive = selectedIds.some(
                (id) =>
                  id.startsWith(scriptMode.charAt(0)) &&
                  getMedalDisplayInfo(mastery[id] || 0, isDark).name === name,
              );
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleMedalGroup(name)}
                  style={{
                    background: isActive ? info.bg : info.unselectedBg,
                    borderColor: isActive ? info.border : info.dimColor,
                    borderWidth: '2px',
                    boxShadow: isActive ? `0 0 12px ${info.color}44` : 'none',
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all relative ${
                    isActive ? 'scale-105 shadow-md' : 'scale-100'
                  }`}
                >
                  <div className="w-[1.4em] h-[1.4em] flex items-center justify-center">
                    {info.icon ? (
                      <info.icon
                        size="100%"
                        fill={info.color}
                        style={{ color: info.color }}
                      />
                    ) : (
                      <div className="w-[80%] h-[80%] border border-dashed rounded-full border-slate-400" />
                    )}
                  </div>
                  <span
                    className={`text-[0.75em] mt-[10%] font-black uppercase tracking-tighter ${
                      isActive
                        ? isDark
                          ? 'text-white'
                          : 'text-slate-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setIsMasteryInfoOpen(true)}
              className={`flex flex-col items-center justify-center py-2.5 rounded-xl border-2 transition-all active:scale-95 ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-[#06948E]'
                  : 'bg-slate-50 border-slate-100 text-[#06948E]'
              }`}
            >
              <div className="w-[1.4em] h-[1.4em] flex items-center justify-center">
                <Info size="100%" />
              </div>
              <span className="text-[0.75em] mt-[10%] font-black uppercase tracking-tighter">
                Guide
              </span>
            </button>
          </div>

          <div
            className={`p-1 flex items-center gap-1 rounded-3xl ${
              isDark ? 'bg-slate-900/60' : 'bg-slate-200/40'
            }`}
          >
            <div className="flex gap-1 flex-1">
              <button
                type="button"
                onClick={() => setSessionDuration(0)}
                className={`flex min-h-8 flex-1 items-center justify-center rounded-xl py-2 text-xs font-bold uppercase transition-all ${
                  sessionDuration === 0
                    ? 'bg-[#06948E] text-white shadow-md'
                    : 'text-slate-500'
                }`}
              >
                Endless
              </button>
              <button
                type="button"
                onClick={() => {
                  if (sessionDuration === 0) setSessionDuration(1);
                }}
                className={`flex min-h-8 flex-1 items-center justify-center rounded-xl py-2 text-xs font-bold uppercase transition-all ${
                  sessionDuration > 0
                    ? 'bg-[#06948E] text-white shadow-md'
                    : 'text-slate-500'
                }`}
              >
                Timed
              </button>
            </div>
            <div
              className={`flex items-center gap-2 px-2 transition-all duration-300 ${
                sessionDuration === 0
                  ? 'opacity-20 grayscale pointer-events-none'
                  : 'opacity-100'
              }`}
            >
              <button
                type="button"
                disabled={sessionDuration === 0}
                onClick={() =>
                  setSessionDuration((prev) => Math.max(1, prev - 1))
                }
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-[#06948E]'
                }`}
              >
                <Minus size={12} />
              </button>
              <span
                className={`text-[11px] font-bold w-10 text-center ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {sessionDuration === 0 ? '---' : `${sessionDuration}m`}
              </span>
              <button
                type="button"
                disabled={sessionDuration === 0}
                onClick={() =>
                  setSessionDuration((prev) => Math.min(15, prev + 1))
                }
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-[#06948E]'
                }`}
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center my-4">
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className={`flex items-center gap-2 px-10 py-2 rounded-full border shadow-sm transition-all active:scale-95 text-[#06948E] ${
              isDark
                ? 'bg-[#06948E]/10 border-[#06948E]/35'
                : 'bg-[#06948E]/5 border-[#06948E]/25'
            }`}
          >
            <RotateCcw size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Reset Selection
            </span>
          </button>
        </div>
        <div className="space-y-4 w-full max-w-xl mx-auto">
          {scriptMode === 'numbers' ? (
            renderGridSection(NUM_LAYOUT, [])
          ) : (
            <>
              {renderGridSection(BASIC_GRID, ['A', 'I', 'U', 'E', 'O'])}
              {renderGridSection(DAKUON_GRID, ['A', 'I', 'U', 'E', 'O'])}
              {renderGridSection(COMBO_GRID, ['A', 'U', 'O'])}
            </>
          )}
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none ${
          isDark
            ? 'from-slate-900 via-slate-900 to-transparent'
            : 'from-slate-50 via-slate-50 to-transparent'
        }`}
      >
        <button
          type="button"
          onClick={startQuiz}
          disabled={selectedIds.length === 0}
          className={`max-w-xl mx-auto w-full py-5 rounded-2xl font-black text-xl tracking-wider uppercase pointer-events-auto transition-all shadow-xl active:scale-95 ${
            selectedIds.length > 0
              ? isDark
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-cyan-600/30'
              : 'bg-slate-300 text-slate-100'
          }`}
        >
          Start Quiz ({selectedIds.length})
        </button>
      </div>
    </div>
  );
};

export default SelectionView;
