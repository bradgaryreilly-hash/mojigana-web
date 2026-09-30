/**
 * Copy for About / Contact / Privacy modals.
 */

export const SITE_INFO_PAGES = {
  about: {
    title: 'About MojiGana',
    paragraphs: [
      'I built MojiGana because I was tired of downloading and deleting apps. In an oversaturated market, I struggled to find a tool that felt right—everything was either too cluttered, too slow, or just didn\'t meet my needs.',
      'My goal is to keep MojiGana simple, clean, and fast. I wanted an interface that stays out of your way and flashcards that feel snappy.',
      'Test the kana you want, in the way you want. If you want to check the answer, go ahead. The focus is entirely on a frictionless, self-guided experience where you\'re the one in control of your progress.',
      'This is just the beginning for MojiGana. I have much more to implement, and I\'m excited to keep building this into the tool I always wanted for myself.',
      'Have feedback?',
      'If you have any issues with the app or have ideas on how to make it better, please do not hesitate to email me. I\'d love to hear from you!',
      '— The MojiGana Creator',
      'contact@mojigana.com',
    ],
  },
  contact: {
    title: 'Contact',
    paragraphs: [
      'For questions, feedback, bug reports, or privacy-related requests, email contact@mojigana.com.',
    ],
  },
  privacy: {
    title: 'Privacy policy',
    paragraphs: [
      'Last updated: September 30, 2026.',
      'This policy explains how MojiGana (“the app”) handles information when you use our website. It is meant to be clear and accurate for our current design; it is not legal advice. If you need certainty for your jurisdiction or business, consult a qualified professional.',
      'Who operates this app — The website and app known as MojiGana are operated by MojiGana. For privacy questions or other inquiries, use contact@mojigana.com.',
      'What we do not do — MojiGana does not require an account. We do not ask for your name, email, or phone number inside the app, and the app does not send your study progress to our own servers.',
      'What is stored on your device — To remember your progress between visits, the app saves data in your browser using local storage. That can include per-character scores, adaptive scheduling weights, which characters you selected, script mode (hiragana/katakana/numbers), timed-session preference, and display/settings toggles. A quiz attempt itself is not saved: while you are on the test screen, the app does not write those updates to storage, and when you leave the quiz or results screen the in-memory session (queue, timers, session stats) is cleared. Longer-term scores update in storage after you leave the quiz. This stays on your device unless you clear site data or your browser vendor syncs storage in a way we do not control.',
      'How to delete this data — You can remove it anytime with your browser’s controls (for example “clear site data” or “clear storage” for this website). That resets progress and settings stored by the app in the browser.',
      'Fonts — The app may load the “Sawarabi Gothic” font from Google Fonts. When that happens, your browser requests files from Google, and Google may process technical data such as IP address as described in Google’s privacy documentation: https://policies.google.com/privacy',
      'Advertising — The site uses Google AdSense to show ads. Google and its partners may use cookies to serve and measure those ads based on visits to this site and others. How Google uses information from sites that use its services: https://policies.google.com/technologies/ads. Ad settings: https://adssettings.google.com.',
      'Domain — The mojigana.com domain is registered through Porkbun. Domain registration and DNS are handled under Porkbun’s terms and privacy policy: https://porkbun.com/privacy',
      'Hosting and logs — The site is published with GitHub Pages. GitHub may process technical data when you load pages or assets; see GitHub’s privacy statement: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement',
      'Cookies — MojiGana’s own study features do not set cookies. Google AdSense may set cookies when ads load, as described above. Local storage is a separate browser mechanism the app uses to remember settings on your device.',
      'Children — The app is a study tool. If you are a parent or guardian and believe we should remove or adjust something, email contact@mojigana.com.',
      'Future changes — If we add features such as accounts or analytics, we will update this policy to describe them.',
      'Contact — For privacy questions, email contact@mojigana.com.',
    ],
  },
};

export const SITE_INFO_ORDER = ['about', 'contact', 'privacy'];
