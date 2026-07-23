'use client';
import { useEffect, useRef } from 'react';
import { visibleItems } from '@/lib/repeater';

function Counter({ value, suffix, label, iconHtml }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = Number(value) || 0;
          const duration = 1400;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          }
          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="stat">
      {iconHtml && (
        <div className="stat-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconHtml }} />
      )}
      <div className="num" data-count={value}>
        <span ref={ref}>0</span>
        {suffix && <span className="plus">{suffix}</span>}
      </div>
      <div className="label">{label}</div>
    </div>
  );
}

export default function StatBar({ data }) {
  const stats = visibleItems(data.stats);
  if (!stats.length) return null;
  return (
    <div className="stat-bar">
      <div className="container stat-grid">
        {stats.map((s, i) => (
          <Counter key={i} value={s.value} suffix={s.suffix} label={s.label} iconHtml={s.iconHtml} />
        ))}
      </div>
    </div>
  );
}
