import { useEffect } from 'react';

const ADSENSE_CLIENT = 'ca-pub-4274255584865555';
const ADSENSE_SCRIPT = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

function ensureAdsScript() {
  if (document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
    return;
  }
  const script = document.createElement('script');
  script.async = true;
  script.src = ADSENSE_SCRIPT;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

/** Horizontal AdSense unit. The loader is added when this unit mounts. */
const AdBanner = ({ className = '', slot = '9680394870' }) => {
  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || [];
    try {
      window.adsbygoogle.push({});
    } catch {
      /* Each slot is filled once. A second push on the same tag is ignored. */
    }
    ensureAdsScript();

    return () => {
      document.querySelectorAll('ins.adsbygoogle').forEach((node) => {
        if (node.getAttribute('data-ad-slot') !== slot) node.remove();
      });
    };
  }, [slot]);

  return (
    <div className={`mx-auto w-full max-w-[728px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
