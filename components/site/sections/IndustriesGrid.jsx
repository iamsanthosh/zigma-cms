import { visibleItems } from '@/lib/repeater';

export default function IndustriesGrid({ data }) {
  const industries = visibleItems(data.industries);
  return (
    <section className="section section-gray" id="industries">
      <div className="container">
        <div className="section-head center">
          {data.eyebrow && <div className="eyebrow eyebrow-orange">{data.eyebrow}</div>}
          {data.heading && <h2>{data.heading}</h2>}
        </div>

        <div className="ind-grid">
          {industries.map((ind, i) => (
            <div className="ind-item" key={i}>
              {ind.iconHtml ? (
                <div className="ind-icon" dangerouslySetInnerHTML={{ __html: ind.iconHtml }} />
              ) : ind.iconSvgPath ? (
                <svg className="ind-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d={ind.iconSvgPath} />
                </svg>
              ) : null}
              <span>{ind.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
