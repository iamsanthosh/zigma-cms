export default function CtaBand({ data }) {
  const hasVideo = !!data.backgroundVideo?.url;

  // Get CTAs from new array structure or fall back to old hardcoded fields
  const ctas = data.ctas || [];
  const hasNewStructure = ctas.length > 0;

  // Fallback to old structure for backward compatibility
  const primaryCta = !hasNewStructure && data.primaryCtaLabel ? {
    label: data.primaryCtaLabel,
    url: data.primaryCtaUrl || '#',
    style: 'highlighted'
  } : null;
  const secondaryCta = !hasNewStructure && data.secondaryCtaLabel ? {
    label: data.secondaryCtaLabel,
    url: data.secondaryCtaUrl || '#',
    style: 'normal'
  } : null;
  const tertiaryCta = !hasNewStructure && data.tertiaryCtaLabel ? {
    label: data.tertiaryCtaLabel,
    url: data.tertiaryCtaUrl || '#',
    style: 'normal'
  } : null;

  const allCtas = hasNewStructure ? ctas : [primaryCta, secondaryCta, tertiaryCta].filter(Boolean);

  // Map style to button class
  const getButtonClass = (style) => {
    switch (style) {
      case 'highlighted':
        return 'btn btn-primary';
      case 'normal':
        return 'btn btn-ghost';
      default:
        return 'btn btn-primary';
    }
  };

  return (
    <section
      className="cta-band"
      id="contact"
      style={
        !hasVideo && data.backgroundImage?.url
          ? { backgroundImage: `url(${data.backgroundImage.url})` }
          : undefined
      }
    >
      {hasVideo && (
        <video className="cta-band-video" autoPlay muted loop playsInline poster={data.backgroundImage?.url}>
          <source src={data.backgroundVideo.url} />
        </video>
      )}

      <div className="container cta-inner">
        {data.heading && <h2>{data.heading}</h2>}
        {data.body && <p>{data.body}</p>}
        <div className="cta-actions">
          {allCtas.map((cta, index) => (
            <a
              key={index}
              href={cta.url || '#'}
              className={getButtonClass(cta.style)}
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
