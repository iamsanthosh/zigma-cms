export default function CertTeaser({ data }) {
  return (
    <section className="cert-teaser">
      <div className="container">
        {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
        {data.heading && <h3>{data.heading}</h3>}
        {data.body && <p>{data.body}</p>}
        {data.ctaLabel && (
          <a href={data.ctaUrl || '#'} className="btn-certs">
            {data.ctaLabel} →
          </a>
        )}
      </div>
    </section>
  );
}
