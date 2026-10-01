import { Play } from 'lucide-react';
import { NEWS_POSTS } from '../../data/news';
import AdBanner from './AdBanner';

const NewsHome = ({ isDark }) => (
  <div className="px-5 sm:px-8 pb-16">
    <div className="pt-8 pb-10 text-center">
      <h1>
        <span className="inline-flex items-center justify-center gap-3">
          <img
            src="/mojigana-icon.jpg"
            alt=""
            width="768"
            height="768"
            className="h-12 w-12 rounded-2xl object-cover"
          />
          <span
            className={`text-5xl font-black tracking-tight ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}
          >
            MojiGana
          </span>
        </span>
        <span
          className={`mt-3 block text-lg font-medium ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Free hiragana and katakana flashcards
        </span>
      </h1>
      <p
        className={`mx-auto mt-4 max-w-md text-[15px] leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        Practice hiragana flashcards, katakana flashcards, and Japanese numbers
        for free. Choose the characters you want, then type the answer or pick
        it from multiple choice. Questions can go from kana to romaji, or from
        romaji to kana.
      </p>
      <a
        href="/flashcards"
        className={`mt-8 inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 font-black text-lg uppercase tracking-wider shadow-xl transition-all active:scale-95 ${
          isDark
            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 shadow-emerald-500/20'
            : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-cyan-600/30'
        }`}
      >
        <Play size={22} fill="currentColor" /> Practice flashcards
      </a>
      <AdBanner className="mt-8" />
    </div>

    <section aria-labelledby="news-heading">
      <h2
        id="news-heading"
        className={`text-[10px] font-black uppercase tracking-widest ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}
      >
        News
      </h2>
      {NEWS_POSTS.length === 0 ? (
        <p
          className={`mt-4 text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          No updates yet.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {NEWS_POSTS.map((post) => (
            <article
              key={`${post.date}-${post.title}`}
              className={`rounded-3xl border px-5 py-5 ${
                isDark
                  ? 'bg-slate-900/50 border-slate-700'
                  : 'bg-white/80 border-slate-200'
              }`}
            >
              <p
                className={`text-[11px] font-bold uppercase tracking-wide ${
                  isDark ? 'text-[#2DD4BF]' : 'text-[#06948E]'
                }`}
              >
                {post.date}
              </p>
              <h3
                className={`mt-2 text-xl font-black tracking-tight ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              >
                {post.title}
              </h3>
              <div className="mt-3 space-y-3">
                {post.paragraphs.map((text) => (
                  <p
                    key={text}
                    className={`text-[15px] leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  </div>
);

export default NewsHome;
