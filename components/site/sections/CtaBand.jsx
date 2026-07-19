export default function CtaBand({ data }) {
  const hasVideo = !!data.backgroundVideo?.url;

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
          {data.primaryCtaLabel && (
            <a href={data.primaryCtaUrl || '#'} className="btn btn-primary">
              {data.primaryCtaLabel}
            </a>
          )}
          {data.secondaryCtaLabel && (
            <a href={data.secondaryCtaUrl || '#'} className="btn btn-ghost">
              {data.secondaryCtaLabel}
            </a>
          )}
          {data.tertiaryCtaLabel && (
            <a href={data.tertiaryCtaUrl || '#'} className="btn btn-ghost">
              {data.tertiaryCtaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
