import { visibleItems } from '@/lib/repeater';

/** Reused for Generate / Protect / Maintain / Experts / Engineering-Design —
 * every one of these is a `split-layout` band with a 4-card feature grid,
 * exactly matching the real template's markup and classes. */
export default function SplitFeature({ data, backgroundStyle }) {
  const imageRight = data.imagePosition !== 'left';
  const features = visibleItems(data.features);

  const mediaBlock = (
    <div className="split-img-wrap reveal">
      {data.image?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.image.url} alt={data.image.alt || data.heading || ''} loading="lazy" />
      )}
      {data.video?.url && (
        <video controls poster={data.image?.url}>
          <source src={data.video.url} />
        </video>
      )}
    </div>
  );

  const textBlock = (
    <div className="split-content reveal">
      {data.eyebrow && (
        <div className="eyebrow" style={{ color: data.eyebrowColor || undefined }}>
          {data.eyebrow}
        </div>
      )}
      {data.heading && <h2>{data.heading}</h2>}
      {data.body && <p className="split-desc">{data.body}</p>}
      {features.length > 0 && (
        <div className="split-feat-grid">
          {features.map((f, i) => (
            <div className="feat-card" key={i}>
              {f.iconSvgPath && (
                <div className="feat-icon-wrap">
                  <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d={f.iconSvgPath} />
                  </svg>
                </div>
              )}
              <h5>{f.title}</h5>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      )}
      {data.ctaLabel && (
        <a href={data.ctaUrl || '#'} className={`btn ${data.ctaStyle === 'ghost-dark' ? 'btn-ghost-dark' : 'btn-primary'} btn-sm btn-hover-lift`}>
          {data.ctaLabel} →
        </a>
      )}
    </div>
  );

  return (
    <section className={`section section-${backgroundStyle || 'light'}`}>
      <div className="container">
        <div className={`split-layout ${imageRight ? 'img-right' : 'img-left'}`}>
          {imageRight ? (
            <>
              {textBlock}
              {mediaBlock}
            </>
          ) : (
            <>
              {mediaBlock}
              {textBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
