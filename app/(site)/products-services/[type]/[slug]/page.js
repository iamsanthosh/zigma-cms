import { getItemBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const item = await getItemBySlug(params.type === 'service' ? 'service' : 'product', params.slug);
  if (!item) return {};
  return { title: `${item.title} | Zigma Technologies`, description: item.subtitle || item.description };
}

export default async function ItemDetailPage({ params }) {
  const type = params.type === 'service' ? 'service' : 'product';
  const item = await getItemBySlug(type, params.slug);
  if (!item) notFound();

  const bg = item.media?.find((m) => m.role === 'background') || item.media?.[0];

  return (
    <section className="section section-light">
      <div className="container">
        {item.tags && (
          <div className="tag-dock" style={{ marginBottom: '1rem' }}>
            {item.tags.split(',').map((t, i) => (
              <span className="tag-pill" key={i}>
                {t.trim()}
              </span>
            ))}
          </div>
        )}

        <h1>{item.title}</h1>
        {item.subtitle && <p className="lead">{item.subtitle}</p>}

        {bg?.url && (
          <div className="split-img-wrap reveal" style={{ margin: '2rem 0' }}>
            {bg.type === 'video' ? (
              <video controls>
                <source src={bg.url} />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bg.url} alt={item.title} />
            )}
          </div>
        )}

        {item.description && <p className="split-desc">{item.description}</p>}

        {Array.isArray(item.specifications) && item.specifications.length > 0 && (
          <table className="admin-table" style={{ marginTop: '1.5rem', maxWidth: 560 }}>
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

        {item.media?.length > 1 && (
          <div className="products-grid" style={{ marginTop: '2rem' }}>
            {item.media
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
          <a href={item.cta_url || '#contact'} className="btn btn-primary" style={{ marginTop: '2rem' }}>
            {item.cta_label}
          </a>
        )}
      </div>
    </section>
  );
}
