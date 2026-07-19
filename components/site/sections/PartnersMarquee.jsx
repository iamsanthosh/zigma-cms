import { visibleItems } from '@/lib/repeater';

export default function PartnersMarquee({ data }) {
  const logos = visibleItems(data.logos);
  if (!logos.length) return null;

  // Original template duplicates the logo set once for a seamless CSS
  // marquee loop (`animation: marqueeLTR ... infinite`) — replicate that
  // by rendering the list twice back to back.
  const doubled = [...logos, ...logos];

  return (
    <section className="section section-light partners-section">
      <div className="container">
        <div className="section-head center">
          {data.eyebrow && <div className="eyebrow eyebrow-orange">{data.eyebrow}</div>}
          {data.heading && <h2>{data.heading}</h2>}
        </div>
      </div>

      <div className="partner-marquee-wrap">
        <div className="partner-marquee">
          {doubled.map((logo, i) => (
            <div className="partner-logo-card" key={i}>
              {logo.logo?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo.logo.url} alt={logo.name || ''} loading="lazy" />
              )}
            </div>
          ))}
        </div>
      </div>

      {data.note && (
        <div className="container">
          <p className="partner-note">{data.note}</p>
        </div>
      )}
    </section>
  );
}
