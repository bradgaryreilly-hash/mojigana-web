import { Medal as MedalIcon, X, AlertTriangle } from 'lucide-react';
import { getMedalDisplayInfo } from '../../lib/medalDisplay';

const MasteryGuideModal = ({
  isDark,
  isMasteryInfoOpen,
  setIsMasteryInfoOpen,
}) => {
  if (!isMasteryInfoOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 touch-none">
      <div
        role="presentation"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setIsMasteryInfoOpen(false)}
      />
      <div
        className={`w-full max-w-sm rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 ${
          isDark ? 'bg-slate-800 text-white' : 'bg-white text-[#0f172a]'
        }`}
      >
        <div
          className={`p-7 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-700' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <MedalIcon size={18} className="text-[#06948E]" />
            <h3 className="font-bold uppercase tracking-wider text-sm">
              Mastery Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsMasteryInfoOpen(false)}
            className="text-slate-400 active:scale-95 transition-all"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-7 space-y-6 overflow-y-auto max-h-[78vh]">
          <div className="space-y-4">
            <div className="bg-[#06948E]/10 px-5 py-4 rounded-2xl border border-[#06948E]/20">
              <p
                className={`text-sm sm:text-[15px] leading-relaxed font-bold ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              >
                Track your progress with character-specific ranks. Reach point
                milestones to earn medals. Higher ranks carry heavier penalties
                for incorrect answers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_50px_40px] px-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <span>Rank</span>
                <span className="text-center">Goal</span>
                <span className="text-center">Loss</span>
              </div>
              <div className="space-y-1">
                {['Platinum', 'Gold', 'Silver', 'Bronze', 'Unranked'].map(
                  (n) => {
                    const info = getMedalDisplayInfo(
                      n === 'Platinum'
                        ? 30
                        : n === 'Gold'
                          ? 20
                          : n === 'Silver'
                            ? 10
                            : n === 'Bronze'
                              ? 4
                              : 0,
                      isDark,
                    );
                    return (
                      <div
                        key={n}
                        className={`grid grid-cols-[1fr_50px_40px] items-center p-3 rounded-xl border ${
                          isDark
                            ? 'bg-slate-900 border-slate-700'
                            : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-[1.4em] h-[1.4em] flex items-center justify-center">
                            {info.icon && (
                              <info.icon
                                size="100%"
                                fill={info.color}
                                style={{ color: info.color }}
                              />
                            )}
                          </div>
                          <span className="text-[10px] font-bold uppercase">
                            {n}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-center text-[#06948E]">
                          {n === 'Unranked' ? '0-3' : `${info.threshold}+`}
                        </span>
                        <span className="text-[10px] font-black text-center text-rose-500">
                          -{info.penalty}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-slate-200/50 flex items-center justify-center gap-1.5">
              <AlertTriangle size={14} className="text-rose-500" />
              <p className="text-[9px] text-center text-rose-500 font-black uppercase tracking-widest">
                Rank progression requires 5+ selected characters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasteryGuideModal;
