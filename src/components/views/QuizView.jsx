import {
  Play,
  ChevronLeft,
  Eye,
  EyeOff,
  Brain,
  Settings,
  Sun,
  Moon,
  Flag,
  Pause,
} from 'lucide-react';

const QuizView = ({
  isDark,
  isSmartTraining,
  sessionDuration,
  timeLeft,
  isPaused,
  setIsPaused,
  setCurrentView,
  toggleTheme,
  setIsSettingsOpen,
  showPrev,
  prevQuizItem,
  showNext,
  nextQuizItem,
  currentQuizItem,
  isCorrect,
  isWrong,
  showingAnswer,
  setShowingAnswer,
  isMultipleChoice,
  quizOptions,
  handleInputChange,
  inputRef,
  inputValue,
  isFocused,
  setIsFocused,
}) => {
  const timerText = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;

  return (
    <div
      className={`absolute inset-0 overflow-hidden flex flex-col touch-none z-30 transition-colors ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      <header
        className={`px-4 h-14 border-b flex items-center justify-between shrink-0 relative z-20 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`}
      >
        <button
          type="button"
          onClick={() => setCurrentView('selection')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 active:scale-95 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div
          className={`absolute left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest px-5 py-1.5 rounded-full border transition-all text-[#06948E] flex gap-1.5 items-center ${
            isDark
              ? 'bg-emerald-950/40 border-[#06948E]/40'
              : 'bg-emerald-50/60 border-[#06948E]/20'
          }`}
        >
          {isSmartTraining && <Brain size={12} />} MojiGana
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all ${
              isDark ? 'text-amber-500' : 'text-black'
            }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 active:scale-95 transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-start p-4 pt-2 gap-4 px-4">
        <div className="grid grid-cols-[1fr_2fr_1fr] items-center justify-center w-full max-w-xl gap-4">
          <div
            className={`flex flex-col items-center gap-1 transition-opacity ${
              showPrev ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className={`w-full aspect-[3/4] max-h-[100px] flex items-center justify-center border-2 rounded-xl relative ${
                isDark
                  ? 'border-slate-800 bg-slate-800/40'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              {prevQuizItem && (
                <>
                  <span
                    style={{ fontFamily: "'Sawarabi Gothic', sans-serif" }}
                    className={`${
                      prevQuizItem.char.length > 1 ? 'text-3xl' : 'text-5xl'
                    } font-bold ${
                      isDark ? 'text-white/30' : 'text-slate-900/30'
                    }`}
                  >
                    {prevQuizItem.char}
                  </span>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        isDark ? 'text-white/30' : 'text-slate-900/30'
                      }`}
                    >
                      {prevQuizItem.romaji}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 relative">
            <div
              className={`flex items-center w-full px-2 gap-2 mb-1 ${
                sessionDuration === 0 ? 'justify-center' : 'justify-between'
              }`}
            >
              {sessionDuration > 0 && (
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-[#06948E]'
                      : 'bg-white border-slate-100 text-[#06948E]'
                  }`}
                >
                  {isPaused ? (
                    <Play size={14} fill="currentColor" />
                  ) : (
                    <Pause size={14} fill="currentColor" />
                  )}
                </button>
              )}
              {sessionDuration > 0 && (
                <span
                  className={`text-lg font-bold tracking-tighter text-[#06948E] ${
                    isPaused ? 'animate-pulse opacity-40' : ''
                  }`}
                >
                  {timerText}
                </span>
              )}
              <button
                type="button"
                onClick={() => setCurrentView('results')}
                className={`px-3 py-1.5 rounded-full border transition-all active:scale-95 flex items-center gap-1.5 text-[#06948E] ${
                  isDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-emerald-50/50 border-[#06948E]/20'
                }`}
              >
                <Flag size={12} />
                <span className="text-[9px] font-black uppercase tracking-wider">
                  End Session
                </span>
              </button>
            </div>
            <div
              style={{ fontSize: 'clamp(1rem, 8vw, 1.5rem)' }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!isPaused) setShowingAnswer(!showingAnswer);
                }
              }}
              className={`w-full aspect-square max-h-[220px] flex flex-col items-center justify-center border-2 rounded-[3.5rem] shadow-xl relative transition-all ${
                isPaused
                  ? isDark
                    ? 'bg-[#06948E]/10 border-[#06948E]/40'
                    : 'bg-emerald-50 border-[#06948E]/20'
                  : isDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-100'
              }`}
              onClick={() => {
                if (!isPaused) setShowingAnswer(!showingAnswer);
              }}
            >
              {isPaused ? (
                <Pause
                  size="3em"
                  fill="currentColor"
                  className="text-[#06948E] animate-pulse"
                />
              ) : (
                <>
                  <span
                    style={{
                      fontFamily: "'Sawarabi Gothic', sans-serif",
                      filter: isCorrect
                        ? 'drop-shadow(0 0 15px #22c55e)'
                        : isWrong
                          ? 'drop-shadow(0 0 15px #ef4444)'
                          : 'none',
                    }}
                    className={`leading-none select-none font-bold ${
                      isDark ? 'text-slate-100' : 'text-slate-950'
                    } ${
                      currentQuizItem?.char.length > 1 ? 'text-[4em]' : 'text-[5.5em]'
                    }`}
                  >
                    {currentQuizItem?.char}
                  </span>
                  {showingAnswer && (
                    <div className="absolute bottom-[10%] text-[0.8em] font-black uppercase text-slate-950">
                      {currentQuizItem?.romaji}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div
            className={`flex flex-col items-center gap-1 transition-opacity ${
              showNext ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className={`w-full aspect-[3/4] max-h-[100px] flex items-center justify-center border-2 rounded-xl relative shadow-sm overflow-hidden ${
                isDark
                  ? 'border-slate-800 bg-slate-800/40'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              {nextQuizItem && (
                <span
                  style={{ fontFamily: "'Sawarabi Gothic', sans-serif" }}
                  className={`${
                    nextQuizItem.char.length > 1 ? 'text-3xl' : 'text-5xl'
                  } font-bold ${isDark ? 'text-white/30' : 'text-slate-900/30'}`}
                >
                  {nextQuizItem.char}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="w-full max-w-xs flex flex-col gap-4">
          {isMultipleChoice ? (
            <div className="grid grid-cols-3 gap-2">
              {quizOptions.map((opt) => (
                <div
                  key={opt}
                  className={`p-[2.5px] rounded-[24px] shadow-lg transition-all duration-300 ${
                    isPaused
                      ? 'bg-slate-500'
                      : isDark
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                        : 'bg-gradient-to-r from-cyan-600 to-emerald-600'
                  }`}
                >
                  <button
                    type="button"
                    disabled={isPaused}
                    onClick={() =>
                      handleInputChange({ target: { value: opt } })
                    }
                    className={`w-full py-4 rounded-[21px] font-black text-lg transition-all active:scale-95 ${
                      isPaused
                        ? 'bg-slate-900 text-slate-500'
                        : isDark
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-[#0f172a]'
                    }`}
                  >
                    {opt.toUpperCase()}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`p-1 rounded-[26px] transition-all duration-300 ${
                isFocused
                  ? isDark
                    ? 'bg-cyan-500/20'
                    : 'bg-cyan-600/10'
                  : ''
              }`}
            >
              <div
                className={`p-[2.5px] rounded-[24px] shadow-lg transition-all duration-300 ${
                  isPaused
                    ? 'bg-slate-500'
                    : isWrong
                      ? isDark
                        ? 'bg-red-950'
                        : 'bg-rose-500'
                      : isDark
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                        : 'bg-gradient-to-r from-cyan-600 to-emerald-600'
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  autoFocus
                  disabled={isPaused}
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isPaused ? 'Paused' : 'Answer...'}
                  autoComplete="off"
                  className={`w-full rounded-[21px] py-4 text-center text-3xl font-black focus:outline-none transition-all ${
                    isPaused
                      ? 'bg-slate-900 text-slate-500 placeholder-slate-500'
                      : isWrong
                        ? isDark
                          ? 'bg-rose-950 text-rose-200 placeholder-rose-400'
                          : 'bg-rose-50 text-rose-700'
                        : isDark
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-[#0f172a]'
                  }`}
                />
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowingAnswer(!showingAnswer)}
            disabled={isPaused}
            className={`flex items-center justify-center gap-2 py-2 text-[#06948E] text-xs font-bold uppercase ${
              isPaused ? 'opacity-30' : ''
            }`}
          >
            {showingAnswer ? <EyeOff size={16} /> : <Eye size={16} />} Show
            Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
