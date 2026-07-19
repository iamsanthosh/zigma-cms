'use client';
import { useEffect, useState } from 'react';
import { visibleItems } from '@/lib/repeater';

export default function Hero({ data }) {
  const slides = visibleItems(data.slides);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, (data.autoplaySeconds || 6) * 1000);
    return () => clearInterval(timer);
  }, [current, slides.length, data.autoplaySeconds]);

  if (!slides.length) return null;

  return (
    <section className="hero-slider" id="home">
      {slides.map((slide, i) => (
        <div className={`slide${i === current ? ' active' : ''}`} key={i}>
          <div className="slide-bg">
            {slide.backgroundImage?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="slide-img"
                src={slide.backgroundImage.url}
                alt={slide.backgroundImage.alt || slide.headline || ''}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            )}
            {slide.backgroundVideo?.url && (
              <video className="slide-img" autoPlay muted loop playsInline>
                <source src={slide.backgroundVideo.url} />
              </video>
            )}
            <div className="slide-scrim" style={{ opacity: slide.overlayOpacity ?? undefined }} />
            <div className="grid-overlay" />
            <div className="tint" />
          </div>

          <div className="container">
            <div className="slide-content">
              {slide.eyebrow && <div className="eyebrow">{slide.eyebrow}</div>}
              {slide.headline && <h1>{slide.headline}</h1>}
              {slide.lead && <p className="lead">{slide.lead}</p>}
              {slide.ctaLabel && (
                <a href={slide.ctaUrl || '#'} className="slide-cta">
                  {slide.ctaLabel} →
                </a>
              )}
            </div>

            {visibleItems(slide.tags).length > 0 && (
              <div className="tag-dock">
                {visibleItems(slide.tags).map((t, ti) => (
                  <span className="tag-pill" key={ti}>
                    {t.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="dot-nav" id="dotNav">
          {slides.map((_, i) => (
            <button
              key={i}
              className={i === current ? 'active' : ''}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            >
              <span className={`fill${i === current ? ' run' : ''}`} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
