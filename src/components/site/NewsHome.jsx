import { Play } from 'lucide-react';
import { NEWS_POSTS } from '../../data/news';
import AdBanner from './AdBanner';

const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

function paragraphWithEmailLinks(text, isDark) {
  const nodes = [];
  let last = 0;
  let match;
  let index = 0;
  const pattern = new RegExp(EMAIL_PATTERN.source, 'g');
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const email = match[0];
    nodes.push(
      <a
        key={`${email}-${index}`}
        href={`mailto:${email}`}
        className={`underline underline-offset-2 ${
          isDark ? 'text-[#2DD4BF]' : 'text-[#06948E]'
        }`}
      >
        {email}
      </a>,
    );
    last = match.index + email.length;
    index += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const NewsHome = ({ isDark }) => (
  <div className="px-5 sm:px-8 pb-16">
    <div className="pt-8 pb-10 text-center">
      <h1
        className={`text-lg font-medium ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        Free hiragana and katakana flashcards
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
                    {paragraphWithEmailLinks(text, isDark)}
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
