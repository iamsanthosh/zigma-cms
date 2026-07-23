import { visibleItems } from '@/lib/repeater';

export default function ProjectsGrid({ data }) {
  const projects = visibleItems(data.projects);
  return (
    <section className="section section-light" id="projects">
      <div className="container">
        <div className="section-head">
          {data.eyebrow && <div className="eyebrow eyebrow-orange">{data.eyebrow}</div>}
          {data.heading && <h2>{data.heading}</h2>}
        </div>

        <div className="proj-grid">
          {projects.map((p, i) => (
            <div className="proj-card" key={i}>
              <div className="proj-media">
                {p.image?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image.url} alt={p.title} loading="lazy" />
                )}
                {p.tags && p.tags.length > 0 && (
                  <div className="proj-tags">
                    {p.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="tag-pill"
                        style={{
                          '--tag-pill-color': tag.color || 'var(--cyan)',
                          borderColor: tag.color ? `${tag.color}66` : 'rgba(0,212,255,0.4)'
                        }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="proj-body">
                <h5>{p.title}</h5>
                {p.stat && <div className="proj-stat">{p.stat}</div>}
                {p.description && <p>{p.description}</p>}
                <a className="link" href={p.url || '#'}>
                  View Case Study →
                </a>
              </div>
            </div>
          ))}
        </div>

        {data.ctaLabel && (
          <div style={{ textAlign: 'center', marginTop: '2.6rem' }}>
            <a href={data.ctaUrl || '#'} className="btn btn-ghost-dark btn-sm">
              {data.ctaLabel} →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
