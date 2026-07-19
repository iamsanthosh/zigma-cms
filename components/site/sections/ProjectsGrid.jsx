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
              {p.image?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image.url} alt={p.title} loading="lazy" />
              )}
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
