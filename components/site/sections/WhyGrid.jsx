import { visibleItems } from '@/lib/repeater';

export default function WhyGrid({ data }) {
  const cards = visibleItems(data.cards);
  return (
    <section className="section section-light why-section" id="why">
      <div className="container">
        <div className="section-head">
          {data.eyebrow && <div className="eyebrow eyebrow-orange">{data.eyebrow}</div>}
          {data.heading && <h2>{data.heading}</h2>}
          {data.body && <p>{data.body}</p>}
        </div>
        <div className="why-grid">
          {cards.map((card, i) => (
            <div className={`why-card is-animated tint-${(i % 6) + 1}`} key={i}>
              <svg className="card-outline" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect className="outline-base" x="0" y="0" width="100" height="100" rx="6" />
                <rect className="outline-highlight" x="0" y="0" width="100" height="100" rx="6" />
              </svg>
              <div className="why-index">{card.index}</div>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
