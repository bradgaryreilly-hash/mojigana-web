import { useLayoutEffect, useRef } from 'react';
import {
  Play,
  ChevronLeft,
  Eye,
  EyeOff,
  Brain,
  Settings,
  Sun,
  Moon,
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
  handleQuizInputKeyDown,
  handleQuizInputKeyUp,
  handleQuizInputBeforeInput,
  manualAnswerConfirm,
  inputRef,
  inputValue,
  isFocused,
  setIsFocused,
}) => {
  const scrollAreaRef = useRef(null);
  const timerText = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;

  useLayoutEffect(() => {
    let alive = true;

    const pinDocumentTop = () => {
      const html = document.documentElement;
      const root = document.scrollingElement ?? html;
      window.scrollTo(0, 0);
      root.scrollTop = 0;
      html.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    const resetQuizScroll = () => {
      pinDocumentTop();
      const area = scrollAreaRef.current;
      if (area) {
        area.scrollTop = 0;
        area.scrollLeft = 0;
      }
    };

    const focusInputWithoutScroll = () => {
      if (isMultipleChoice || isPaused) return;
      inputRef.current?.focus({ preventScroll: true });
    };

    resetQuizScroll();
    focusInputWithoutScroll();

    const id = requestAnimationFrame(() => {
      if (!alive) return;
      resetQuizScroll();
      focusInputWithoutScroll();
      requestAnimationFrame(() => {
        if (!alive) return;
        resetQuizScroll();
        focusInputWithoutScroll();
      });
    });

    return () => {
      alive = false;
      cancelAnimationFrame(id);
    };
  }, [isMultipleChoice, isPaused, inputRef]);

  return (
    <div
      className={`relative z-30 flex min-h-0 w-full flex-1 flex-col overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      <header
        className={`relative flex h-14 shrink-0 items-center justify-between border-b px-4 ${
          isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
        }`}
      >
        <button
          type="button"
          onClick={() => setCurrentView('selection')}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-400 transition-all active:scale-95"
        >
          <ChevronLeft size={24} strokeWidth={2.25} />
        </button>
        <div
          className={`absolute left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-widest px-5 py-1.5 sm:text-xs rounded-full border-2 transition-all text-[#06948E] flex gap-1.5 items-center ${
            isDark
              ? 'border-[#06948E]/50 bg-slate-800/90'
              : 'border-[#06948E]/35 bg-white shadow-md'
          }`}
        >
          {isSmartTraining && (
            <Brain size={13} strokeWidth={2.25} className="shrink-0 text-[#06948E]" />
          )}{' '}
          MojiGana
        </div>
        <div className="flex shrink-0 items-center gap-1">
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
      <div
        ref={scrollAreaRef}
        className="flex min-h-0 flex-1 flex-col items-center justify-start gap-4 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-4 pt-2 [-webkit-overflow-scrolling:touch]"
      >
        <div className="grid grid-cols-[1fr_2fr_1fr] items-stretch justify-center w-full max-w-xl gap-4 min-h-0">
          <div className="flex flex-col h-full min-h-0 w-full min-w-0">
            <div
              className={`shrink-0 w-full transition-opacity ${
                showPrev ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className={`w-full aspect-[3/4] max-h-[132px] flex items-center justify-center border-2 rounded-2xl relative ${
                  isDark
                    ? 'border-slate-800 bg-slate-800/40'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                {prevQuizItem && (
                  <>
                    <span
                      style={{
                        fontFamily: "'Sawarabi Gothic', sans-serif",
                        wordBreak: 'keep-all',
                      }}
                      className={`whitespace-nowrap ${
                        prevQuizItem.char.length > 1 ? 'text-4xl' : 'text-6xl'
                      } font-bold ${
                        isDark ? 'text-white/30' : 'text-slate-900/30'
                      }`}
                    >
                      {prevQuizItem.char}
                    </span>
                    <div className="absolute bottom-1.5 left-0 right-0 px-0.5 text-center">
                      <span
                        className={`line-clamp-2 text-xs font-black uppercase leading-tight tracking-wide sm:text-sm ${
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
            <div className="flex-1 min-h-0 w-full flex items-center justify-center px-0.5 py-1.5">
              <button
                type="button"
                onClick={() => setShowingAnswer(!showingAnswer)}
                disabled={isPaused}
                aria-pressed={showingAnswer}
                aria-label={showingAnswer ? 'Hide answer on card' : 'Show answer on card'}
                className={`flex flex-col items-center justify-center gap-1.5 box-border
                  w-[min(100%,5.25rem)] h-[min(100%,6rem)] min-h-[3rem] max-h-[70%]
                  rounded-xl border-2 text-[10px] font-black uppercase tracking-wide transition-all active:scale-[0.97] ${
                  isPaused
                    ? 'opacity-30 pointer-events-none border-slate-600/50'
                    : showingAnswer
                      ? isDark
                        ? 'border-[#06948E]/55 bg-[#06948E]/12 text-white'
                        : 'border-[#06948E]/40 bg-[#06948E]/10 text-[#06948E]'
                      : isDark
                        ? 'border-[#06948E]/50 bg-slate-800/90 text-[#06948E]'
                        : 'border-[#06948E]/35 bg-white text-[#06948E] shadow-md'
                }`}
              >
                {showingAnswer ? <EyeOff size={20} strokeWidth={2.25} /> : <Eye size={20} strokeWidth={2.25} />}
                <span>Show</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 relative w-full min-w-0 min-h-0">
            <div
              style={{
                fontSize: 'clamp(0.9rem, 5.5vmin, 1.5rem)',
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!isPaused) setShowingAnswer(!showingAnswer);
                }
              }}
              className={`w-full aspect-square max-h-[220px] flex flex-col items-center justify-center border-2 rounded-3xl shadow-xl relative transition-all ${
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
                <div className="relative flex min-h-0 w-full flex-1 flex-col px-2 py-2">
                  <div className="flex min-h-0 flex-1 items-center justify-center">
                    <span
                      style={{
                        fontFamily: "'Sawarabi Gothic', sans-serif",
                        wordBreak: 'keep-all',
                        filter: isCorrect
                          ? 'drop-shadow(0 0 15px #22c55e)'
                          : isWrong
                            ? 'drop-shadow(0 0 15px #ef4444)'
                            : 'none',
                      }}
                      className={`max-w-full text-center leading-none select-none font-bold whitespace-nowrap ${
                        isDark ? 'text-slate-100' : 'text-slate-950'
                      } ${
                        currentQuizItem?.char.length > 1 ? 'text-[3.35em]' : 'text-[5em]'
                      }`}
                    >
                      {currentQuizItem?.char}
                    </span>
                  </div>
                  {showingAnswer ? (
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 top-[42%] z-10 flex items-end justify-center px-3 pb-3"
                      aria-live="polite"
                    >
                      <span
                        className={`line-clamp-3 text-center text-base font-black uppercase leading-tight tracking-wide sm:text-lg ${
                          isDark ? 'text-slate-100' : 'text-slate-800'
                        }`}
                      >
                        {currentQuizItem?.romaji}
                      </span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            {sessionDuration > 0 && (
              <div className="flex items-center justify-center w-full px-2 gap-3 mt-1">
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
                <span
                  className={`text-lg font-bold tracking-tighter text-[#06948E] ${
                    isPaused ? 'animate-pulse opacity-40' : ''
                  }`}
                >
                  {timerText}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col h-full min-h-0 w-full min-w-0">
            <div
              className={`shrink-0 w-full transition-opacity ${
                showNext ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className={`w-full aspect-[3/4] max-h-[132px] flex items-center justify-center border-2 rounded-2xl relative shadow-sm overflow-hidden ${
                  isDark
                    ? 'border-slate-800 bg-slate-800/40'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                {nextQuizItem && (
                  <span
                    style={{
                      fontFamily: "'Sawarabi Gothic', sans-serif",
                      wordBreak: 'keep-all',
                    }}
                    className={`whitespace-nowrap ${
                      nextQuizItem.char.length > 1 ? 'text-4xl' : 'text-6xl'
                    } font-bold ${isDark ? 'text-white/30' : 'text-slate-900/30'}`}
                  >
                    {nextQuizItem.char}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 min-h-0 w-full flex items-center justify-center px-0.5 py-1.5">
              <button
                type="button"
                onClick={() => setCurrentView('results')}
                className={`flex flex-col items-center justify-center box-border
                  w-[min(100%,5.25rem)] h-[min(100%,6rem)] min-h-[3rem] max-h-[70%]
                  rounded-xl border-2 text-xs font-black uppercase tracking-wide transition-all active:scale-[0.97] text-[#06948E] ${
                  isDark
                    ? 'border-[#06948E]/50 bg-slate-800/90'
                    : 'border-[#06948E]/35 bg-white shadow-md'
                }`}
              >
                End
              </button>
            </div>
          </div>
        </div>
        <div className="w-full max-w-md mx-auto flex flex-col gap-3 sm:gap-4">
          {isMultipleChoice ? (
            <div className="grid grid-cols-3 gap-2">
              {quizOptions.map((opt) => (
                <div
                  key={opt}
                  className={`p-[2.5px] rounded-[20px] sm:rounded-[24px] shadow-lg transition-all duration-300 ${
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
                    className={`w-full py-3 sm:py-4 rounded-[17px] sm:rounded-[21px] font-black text-base sm:text-lg transition-all active:scale-95 ${
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
              className={`p-[3px] sm:p-1 rounded-[22px] sm:rounded-[26px] transition-all duration-300 w-full ${
                isFocused
                  ? isDark
                    ? 'bg-cyan-500/20'
                    : 'bg-cyan-600/10'
                  : ''
              }`}
            >
              <div
                className={`p-[2px] sm:p-[2.5px] rounded-[18px] sm:rounded-[24px] shadow-lg transition-all duration-300 ${
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
                  disabled={isPaused}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBeforeInput={handleQuizInputBeforeInput}
                  onKeyDown={handleQuizInputKeyDown}
                  onKeyUp={handleQuizInputKeyUp}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={
                    isPaused
                      ? 'Paused'
                      : manualAnswerConfirm
                        ? 'Enter or Space…'
                        : 'Answer...'
                  }
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className={`w-full rounded-[16px] sm:rounded-[21px] py-2.5 sm:py-4 text-center text-xl sm:text-3xl font-black focus:outline-none transition-all ${
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
        </div>
      </div>
    </div>
  );
};

export default QuizView;
