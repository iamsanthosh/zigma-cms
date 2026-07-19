import { visibleItems } from '@/lib/repeater';

export default function LegacyBand({ data }) {
  const milestones = visibleItems(data.milestones);
  return (
    <section className="section section-dark" id="legacy">
      <div className="container">
        <div className="section-head">
          {data.eyebrow && <div className="eyebrow eyebrow-cyan">{data.eyebrow}</div>}
          {data.heading && <h2>{data.heading}</h2>}
        </div>

        {milestones.length > 0 && (
          <div className="timeline-scroller">
            {milestones.map((m, i) => (
              <div className={`timeline-item${m.isCurrent ? ' now' : ''}`} key={i}>
                <div className="timeline-dot" />
                <div className="timeline-year">{m.year}</div>
                <h5>{m.title}</h5>
                <p>{m.description}</p>
              </div>
            ))}
          </div>
        )}

        {data.ctaLabel && (
          <a href={data.ctaUrl || '#'} className="btn btn-ghost btn-sm" style={{ marginTop: '2rem' }}>
            {data.ctaLabel} →
          </a>
        )}
      </div>
    </section>
  );
}
