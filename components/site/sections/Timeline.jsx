'use client';

import { visibleItems } from '@/lib/repeater';

export default function Timeline({ data, backgroundStyle }) {
  if (!data) {
    return null;
  }
  
  const items = visibleItems(data.items);
  
  const eyebrowClasses = data.eyebrowClassName ? `eyebrow ${data.eyebrowClassName}` : 'eyebrow';
  const eyebrowStyle = data.eyebrowColor ? { color: data.eyebrowColor } : undefined;
  
  // Timeline year/dot color from data or default to cyan
  const timelineYearColor = data.timelineYearColor || '#00D4FF';
  
  // Alignment settings
  const sectionHeadAlignment = data.alignment || 'center';
  const itemAlignment = data.itemAlignment || 'center';
  const sectionHeadClasses = `section-head ${sectionHeadAlignment}`;

  return (
    <section className={`section section-${backgroundStyle || 'light'}`}>
      <div className="container">
        <div className={sectionHeadClasses}>
          {data.eyebrow && (
            <div className={eyebrowClasses} style={eyebrowStyle}>
              {data.eyebrow}
            </div>
          )}
          {data.heading && <h2>{data.heading}</h2>}
          {data.body && <p>{data.body}</p>}
        </div>

        <div className="timeline-scroller">
          {items.map((item, i) => (
            <div className={`timeline-item ${item.isCurrent ? 'is-current' : ''}`} key={i} style={{ textAlign: itemAlignment }}>
              <div className="timeline-dot" style={{ borderColor: timelineYearColor, backgroundColor: item.isCurrent ? timelineYearColor : 'var(--bg-light, #f5f5f5)' }} />
              <div className="timeline-year" style={{ color: timelineYearColor }}>{item.year}</div>
              <h5>{item.title}</h5>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {data.ctaLabel && (
          <a href={data.ctaUrl || '#'} className="btn btn-ghost btn-sm" style={{ marginTop: '2rem' }}>
            {data.ctaLabel} →
          </a>
        )}
      </div>

      <style jsx>{`
        .timeline-scroller {
          display: flex;
          overflow-x: auto;
          gap: 2rem;
          padding: 2rem 0;
          margin-top: 2rem;
          scroll-behavior: smooth;
        }

        .timeline-scroller::-webkit-scrollbar {
          height: 6px;
        }

        .timeline-scroller::-webkit-scrollbar-track {
          background: transparent;
        }

        .timeline-scroller::-webkit-scrollbar-thumb {
          background: var(--accent, #00D4FF);
          border-radius: 3px;
        }

        .timeline-item {
          flex: 0 0 300px;
          position: relative;
          padding-top: 40px;
          padding-bottom: 1rem;
        }

        .timeline-dot {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid;
          transition: all 0.3s ease;
        }

        .timeline-item.is-current .timeline-dot {
          box-shadow: 0 0 0 8px rgba(0, 212, 255, 0.1);
          transform: translateX(-50%) scale(1.3);
        }

        .timeline-year {
          font-weight: bold;
          font-size: 0.9rem;
          margin: 0.5rem 0 0 0;
        }

        .timeline-item h5 {
          margin: 0.5rem 0 0 0;
          font-size: 1.1rem;
        }

        .timeline-item p {
          margin: 0.5rem 0 0 0;
          color: var(--text-secondary, #666);
          font-size: 0.9rem;
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
