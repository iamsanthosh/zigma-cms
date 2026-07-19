'use client';
import { useEffect, useState } from 'react';

export default function ProductsGrid({ data }) {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  async function openItem(item) {
    // The list endpoint omits the media gallery for payload size; fetch the
    // full record (with `media`) only when the tile is actually clicked.
    const res = await fetch(`/api/public/${item._type}s?slug=${encodeURIComponent(item.slug)}`);
    const full = await res.json();
    setActive(full || item);
  }

  useEffect(() => {
    const params = new URLSearchParams();
    if (data.tagFilter) params.set('tag', data.tagFilter);
    const source = data.source || 'products';

    async function load() {
      const requests = [];
      if (source === 'products' || source === 'both') requests.push(fetch(`/api/public/products?${params}`).then((r) => r.json()));
      if (source === 'services' || source === 'both') requests.push(fetch(`/api/public/services?${params}`).then((r) => r.json()));
      const results = await Promise.all(requests);
      setItems(results.flat());
      setLoading(false);
    }
    load();
  }, [data.tagFilter, data.source]);

  return (
    <section className="section section-light" id="products-services">
      <div className="container">
        <div className="section-head">
          {data.eyebrow && <div className="eyebrow eyebrow-orange">{data.eyebrow}</div>}
          {data.heading && <h2>{data.heading}</h2>}
          {data.body && <p>{data.body}</p>}
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div
            className="products-grid"
            style={{ gridTemplateColumns: `repeat(${data.columns || 3}, 1fr)` }}
          >
            {items.map((item) => (
              <button
                key={`${item._type}-${item.id}`}
                className="product-tile"
                onClick={() => openItem(item)}
                style={{ textAlign: 'left', width: '100%' }}
              >
                <div className="product-tile-media">
                  {item.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnail_url} alt={item.title} loading="lazy" />
                  )}
                </div>
                <div className="product-tile-body">
                  <h4>{item.title}</h4>
                  {item.subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--graphite-500)' }}>{item.subtitle}</p>}
                  {item.price_label && <p className="eyebrow eyebrow-orange">{item.price_label}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {active && <ItemModal item={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function ItemModal({ item, onClose }) {
  const media = item.media || [];
  const bg = media.find((m) => m.role === 'background') || media[0];

  return (
    <div className="item-modal-backdrop" onClick={onClose}>
      <div className="item-modal" onClick={(e) => e.stopPropagation()}>
        <button className="item-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="item-modal-media">
          {bg?.type === 'video' ? (
            <video controls autoPlay muted loop>
              <source src={bg.url} />
            </video>
          ) : bg?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bg.url} alt={item.title} />
          ) : null}
        </div>

        <div className="item-modal-body">
          {item.tags && (
            <div className="tag-dock" style={{ marginBottom: '1rem' }}>
              {item.tags.split(',').map((t, i) => (
                <span className="tag-pill" key={i}>
                  {t.trim()}
                </span>
              ))}
            </div>
          )}
          <h2>{item.title}</h2>
          {item.subtitle && <p className="lead">{item.subtitle}</p>}
          {item.description && <p>{item.description}</p>}

          {Array.isArray(item.specifications) && item.specifications.length > 0 && (
            <table className="admin-table" style={{ marginTop: '1rem' }}>
              <tbody>
                {item.specifications.map((s, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{s.label}</td>
                    <td>{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {media.length > 1 && (
            <div className="products-grid" style={{ marginTop: '1.5rem' }}>
              {media
                .filter((m) => m.id !== bg?.id)
                .map((m) => (
                  <div className="product-tile-media" key={m.id}>
                    {m.type === 'video' ? (
                      <video controls>
                        <source src={m.url} />
                      </video>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt={m.alt_text || item.title} loading="lazy" />
                    )}
                  </div>
                ))}
            </div>
          )}

          {item.cta_label && (
            <a href={item.cta_url || '#contact'} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              {item.cta_label}
            </a>
          )}

          <div style={{ marginTop: '1rem' }}>
            <a href={`/products-services/${item._type}/${item.slug}`} style={{ fontSize: '0.85rem' }}>
              View full details page →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
