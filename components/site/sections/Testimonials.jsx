'use client';
import { useState } from 'react';
import { visibleItems } from '@/lib/repeater';

export default function Testimonials({ data }) {
  const items = visibleItems(data.items);
  const [active, setActive] = useState(0);
  if (!items.length) return null;

  return (
    <section className="section section-dark testi-section">
      <div className="container">
        <div className="section-head center">
          {data.eyebrow && <div className="eyebrow eyebrow-cyan">{data.eyebrow}</div>}
          {data.heading && <h2>{data.heading}</h2>}
        </div>

        <div className="testi-wrap">
          {items.map((t, i) => (
            <div className={`testi-slide${i === active ? ' active' : ''}`} key={i}>
              <p className="testi-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testi-person">
                {t.name?.toUpperCase()} <span>· {t.role}</span>
              </div>
            </div>
          ))}
          {items.length > 1 && (
            <div className="testi-dots">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={i === active ? 'active' : ''}
                  data-slide={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
