import { useEffect } from 'react';

/** Horizontal AdSense unit. The loader script already lives in index.html. */
const AdBanner = ({ className = '', slot = '9680394870' }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* Each slot is filled once. A second push on the same tag is ignored. */
    }
  }, []);

  return (
    <div className={`mx-auto w-full max-w-[728px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4274255584865555"
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
