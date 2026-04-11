import { X } from 'lucide-react';
import { SITE_INFO_PAGES } from '../../data/siteInfoContent';

const InfoPagesModal = ({ isDark, infoModal, setInfoModal }) => {
  if (!infoModal) return null;

  const page = SITE_INFO_PAGES[infoModal];
  if (!page) return null;

  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 touch-none animate-in fade-in duration-200">
      <div
        role="presentation"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setInfoModal(null)}
      />
      <div
        className={`w-full max-w-sm rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 ${
          isDark ? 'bg-slate-800 text-white' : 'bg-white text-[#0f172a]'
        }`}
      >
        <div
          className={`p-5 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-700' : 'border-slate-100'
          }`}
        >
          <h3 className="font-bold uppercase tracking-wider text-sm pr-4">
            {page.title}
          </h3>
          <button
            type="button"
            onClick={() => setInfoModal(null)}
            className="text-slate-400 active:scale-95 transition-all shrink-0"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto space-y-4">
          {page.paragraphs.map((text, i) => (
            <p
              key={i}
              className={`text-[13px] leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoPagesModal;
