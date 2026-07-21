'use client';

import { visibleItems } from '@/lib/repeater';

export default function Timeline({ data }) {
  const items = visibleItems(data.items);

  return (
    <section className="section section-light">
      <div className="container">
        <div className="section-head center">
          {data.eyebrow && <div className="eyebrow eyebrow-orange">{data.eyebrow}</div>}
          {data.heading && <h2>{data.heading}</h2>}
          {data.body && <p>{data.body}</p>}
        </div>

        <div className="timeline">
          {items.map((item, i) => (
            <div className={`timeline-item ${item.isCurrent ? 'is-current' : ''}`} key={i}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-year">{item.year}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .timeline {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-top: 3rem;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--accent, #00D4FF), transparent);
        }

        .timeline-item {
          position: relative;
          padding-left: 80px;
          padding-bottom: 1rem;
        }

        .timeline-dot {
          position: absolute;
          left: 10px;
          top: 5px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--bg-light, #f5f5f5);
          border: 3px solid var(--accent, #00D4FF);
          transition: all 0.3s ease;
        }

        .timeline-item.is-current .timeline-dot {
          background: var(--accent, #00D4FF);
          box-shadow: 0 0 0 8px rgba(0, 212, 255, 0.1);
        }

        .timeline-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .timeline-year {
          font-weight: bold;
          color: var(--accent, #00D4FF);
          font-size: 0.9rem;
        }

        .timeline-item h4 {
          margin: 0;
          font-size: 1.2rem;
        }

        .timeline-item p {
          margin: 0;
          color: var(--text-secondary, #666);
          font-size: 0.95rem;
        }
      `}</style>
    </section>
  );
}
