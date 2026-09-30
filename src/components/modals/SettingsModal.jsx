import { Settings, X } from 'lucide-react';
import { SITE_INFO_ORDER, SITE_INFO_PAGES } from '../../data/siteInfoContent';
import { pathForInfoKey } from '../../lib/sitePaths';

const SettingsModal = ({
  isDark,
  isSettingsOpen,
  setIsSettingsOpen,
  isMultipleChoice,
  setIsMultipleChoice,
  multipleChoiceCount,
  setMultipleChoiceCount,
  mcRomajiPrompt,
  setMcRomajiPrompt,
  isSmartTraining,
  setIsSmartTraining,
  showPrev,
  setShowPrev,
  showNext,
  setShowNext,
  manualAnswerConfirm,
  setManualAnswerConfirm,
}) => {
  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 touch-none animate-in fade-in duration-200">
      <div
        role="presentation"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setIsSettingsOpen(false)}
      />
      <div
        className={`w-full max-w-xs rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 ${
          isDark ? 'bg-slate-800 text-white' : 'bg-white text-[#0f172a]'
        }`}
      >
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isDark ? 'border-slate-700' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-[#06948E]" />
            <h3 className="font-bold uppercase tracking-wider text-sm">
              Settings
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="text-slate-400 active:scale-95 transition-all"
          >
            <X size={24} />
          </button>
        </div>
        <div className="max-h-[min(78dvh,36rem)] overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <span className="font-bold text-sm">Answer</span>
            <div
              className={`flex rounded-full p-0.5 ${
                isDark ? 'bg-slate-900/90' : 'bg-slate-100'
              }`}
              role="group"
              aria-label="Answer type"
            >
              <button
                type="button"
                aria-pressed={!isMultipleChoice}
                onClick={() => setIsMultipleChoice(false)}
                className={`flex-1 rounded-full py-2 text-[10px] font-black uppercase tracking-wide transition-all active:scale-[0.99] ${
                  !isMultipleChoice
                    ? isDark
                      ? 'bg-emerald-500 text-slate-900 shadow-sm'
                      : 'bg-white text-[#06948E] shadow-sm'
                    : isDark
                      ? 'text-slate-400'
                      : 'text-slate-500'
                }`}
              >
                Text
              </button>
              <button
                type="button"
                aria-pressed={isMultipleChoice}
                onClick={() => setIsMultipleChoice(true)}
                className={`flex-1 rounded-full py-2 text-[10px] font-black uppercase tracking-wide transition-all active:scale-[0.99] ${
                  isMultipleChoice
                    ? isDark
                      ? 'bg-emerald-500 text-slate-900 shadow-sm'
                      : 'bg-white text-[#06948E] shadow-sm'
                    : isDark
                      ? 'text-slate-400'
                      : 'text-slate-500'
                }`}
              >
                Multiple choice
              </button>
            </div>
          </div>
          {isMultipleChoice && (
            <div className="space-y-2">
              <span className="font-bold text-sm">Choices</span>
              <div
                className={`flex rounded-full p-0.5 ${
                  isDark ? 'bg-slate-900/90' : 'bg-slate-100'
                }`}
                role="group"
                aria-label="Number of choices"
              >
                {[3, 4, 5, 6].map((count) => (
                  <button
                    key={count}
                    type="button"
                    aria-pressed={multipleChoiceCount === count}
                    onClick={() => setMultipleChoiceCount(count)}
                    className={`flex-1 rounded-full py-2 text-[10px] font-black uppercase tracking-wide transition-all active:scale-[0.99] ${
                      multipleChoiceCount === count
                        ? isDark
                          ? 'bg-emerald-500 text-slate-900 shadow-sm'
                          : 'bg-white text-[#06948E] shadow-sm'
                        : isDark
                          ? 'text-slate-400'
                          : 'text-slate-500'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isMultipleChoice && (
            <div className="space-y-2">
              <span className="font-bold text-sm">Question</span>
              <div
                className={`flex rounded-full p-0.5 ${
                  isDark ? 'bg-slate-900/90' : 'bg-slate-100'
                }`}
                role="group"
                aria-label="Question direction"
              >
                <button
                  type="button"
                  aria-pressed={!mcRomajiPrompt}
                  onClick={() => setMcRomajiPrompt(false)}
                  className={`flex-1 rounded-full px-1 py-2 text-[9px] font-black uppercase tracking-wide transition-all active:scale-[0.99] ${
                    !mcRomajiPrompt
                      ? isDark
                        ? 'bg-emerald-500 text-slate-900 shadow-sm'
                        : 'bg-white text-[#06948E] shadow-sm'
                      : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                  }`}
                >
                  Kana → Romaji
                </button>
                <button
                  type="button"
                  aria-pressed={mcRomajiPrompt}
                  onClick={() => setMcRomajiPrompt(true)}
                  className={`flex-1 rounded-full px-1 py-2 text-[9px] font-black uppercase tracking-wide transition-all active:scale-[0.99] ${
                    mcRomajiPrompt
                      ? isDark
                        ? 'bg-emerald-500 text-slate-900 shadow-sm'
                        : 'bg-white text-[#06948E] shadow-sm'
                      : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                  }`}
                >
                  Romaji → Kana
                </button>
              </div>
            </div>
          )}
          {!isMultipleChoice && (
            <div className="space-y-2">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm">Complete</span>
                <span className="text-[10px] text-slate-500 font-medium leading-snug">
                  Auto checks as you type. Manual uses Enter or Space to submit.
                </span>
              </div>
              <div
                className={`flex rounded-full p-0.5 ${
                  isDark ? 'bg-slate-900/90' : 'bg-slate-100'
                }`}
                role="group"
                aria-label="Complete mode"
              >
                <button
                  type="button"
                  aria-pressed={!manualAnswerConfirm}
                  onClick={() => setManualAnswerConfirm(false)}
                  className={`flex-1 rounded-full py-2 text-[10px] font-black uppercase tracking-wide transition-all active:scale-[0.99] ${
                    !manualAnswerConfirm
                      ? isDark
                        ? 'bg-emerald-500 text-slate-900 shadow-sm'
                        : 'bg-white text-[#06948E] shadow-sm'
                      : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                  }`}
                >
                  Auto complete
                </button>
                <button
                  type="button"
                  aria-pressed={manualAnswerConfirm}
                  onClick={() => setManualAnswerConfirm(true)}
                  className={`flex-1 rounded-full py-2 text-[10px] font-black uppercase tracking-wide transition-all active:scale-[0.99] ${
                    manualAnswerConfirm
                      ? isDark
                        ? 'bg-emerald-500 text-slate-900 shadow-sm'
                        : 'bg-white text-[#06948E] shadow-sm'
                      : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                  }`}
                >
                  Manual complete
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-sm">Adaptive Training</span>
              <span className="text-[10px] text-slate-500 font-medium">
                Incorrect answers appear more often
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsSmartTraining(!isSmartTraining)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                isSmartTraining ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                  isSmartTraining ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">Show Previous</span>
            <button
              type="button"
              onClick={() => setShowPrev(!showPrev)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                showPrev ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                  showPrev ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">Show Next</span>
            <button
              type="button"
              onClick={() => setShowNext(!showNext)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                showNext ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                  showNext ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div
            className={`pt-4 border-t space-y-2 ${
              isDark ? 'border-slate-700' : 'border-slate-100'
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Information
            </p>
            <div className="flex flex-col gap-2">
              {SITE_INFO_ORDER.map((key) => (
                <a
                  key={key}
                  href={pathForInfoKey(key)}
                  className={`block w-full text-left py-3 px-4 rounded-2xl text-sm font-bold transition-all active:scale-[0.99] ${
                    isDark
                      ? 'bg-slate-900/80 text-slate-200 border border-slate-700 hover:border-[#06948E]/50'
                      : 'bg-slate-50 text-slate-800 border border-slate-100 hover:border-[#06948E]/30'
                  }`}
                >
                  {SITE_INFO_PAGES[key].title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
