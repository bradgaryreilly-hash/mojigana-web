import { SITE_INFO_PAGES } from '../../data/siteInfoContent';

const TOKEN = /(https?:\/\/[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

const RichText = ({ text, isDark }) => {
  const linkClass = isDark
    ? 'text-[#2DD4BF] underline underline-offset-2'
    : 'text-[#06948E] underline underline-offset-2';
  const nodes = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const token = match[0];
    const isEmail = token.includes('@') && !token.startsWith('http');
    nodes.push(
      <a
        key={`${index}-${token}`}
        href={isEmail ? `mailto:${token}` : token}
        className={linkClass}
        {...(isEmail
          ? {}
          : { target: '_blank', rel: 'noreferrer' })}
      >
        {token}
      </a>,
    );
    last = index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

const InfoPage = ({ pageKey, isDark }) => {
  const page = SITE_INFO_PAGES[pageKey];
  if (!page) return null;

  return (
    <article className="px-5 sm:px-8 pt-8 pb-16">
      <h1
        className={`text-3xl font-black tracking-tight ${
          isDark ? 'text-slate-100' : 'text-slate-800'
        }`}
      >
        {page.title}
      </h1>
      <div className="mt-6 space-y-4">
        {page.paragraphs.map((text) => (
          <p
            key={text}
            className={`text-[15px] leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <RichText text={text} isDark={isDark} />
          </p>
        ))}
      </div>
    </article>
  );
};

export default InfoPage;
