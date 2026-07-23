'use client';

export default function HeaderSection({ data }) {
  if (!data || !data.title) return null;

  return (
    <section className="section section-header" id={data.id || 'header'} style={data.backgroundStyle ? { backgroundColor: data.backgroundStyle } : {}}>
      <div className="container">
        <div className="section-head">
          {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
          {data.title && <h1>{data.title}</h1>}
          {data.subtitle && <p className="lead">{data.subtitle}</p>}
        </div>

        {data.cta_label && (
          <a href={data.cta_url || '#'} className="btn btn-primary">
            {data.cta_label}
          </a>
        )}
      </div>
    </section>
  );
}
