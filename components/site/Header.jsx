'use client';
import { useEffect, useState } from 'react';

/** Groups a dropdown's children into mega-menu columns by their column_heading,
 * preserving first-seen order — mirrors the template's multi-column mega menu
 * (e.g. "What We Do" has 4 columns: Generate / Protect & Power / Maintain / Engineering). */
function groupIntoColumns(children) {
  const columns = [];
  const byHeading = new Map();
  for (const child of children) {
    const heading = child.column_heading || '';
    if (!byHeading.has(heading)) {
      const col = { heading, links: [] };
      byHeading.set(heading, col);
      columns.push(col);
    }
    byHeading.get(heading).links.push(child);
  }
  return columns;
}

export default function Header({ nav, settings }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header id="siteHeader" className={scrolled ? 'scrolled' : ''}>
      <div className="container nav-wrap">
        <a href="/" className="logo">
          <span className="logo-chip">
            {settings.logoImage?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoImage.url} alt={settings.siteName || 'Logo'} />
            ) : (
              <span style={{ fontWeight: 700 }}>Z</span>
            )}
          </span>
          <span className="logo-word">
            {settings.siteName || 'Zigma Technologies'}
            <small>{settings.tagline || 'POWER & ENERGY ENGINEERING'}</small>
          </span>
        </a>

        <nav className="primary-nav">
          <ul className="nav-links">
            {(nav?.items || []).map((item) => (
              <li key={item.id}>
                <a href={item.url}>
                  {item.label}
                  {item.children?.length > 0 && <span className="caret">▾</span>}
                </a>
                {item.children?.length > 0 && (
                  <div className="mega">
                    {groupIntoColumns(item.children).map((col, i) => (
                      <div className="mega-col" key={i}>
                        {col.heading && <h5>{col.heading}</h5>}
                        {col.links.map((child) => (
                          <a key={child.id} href={child.url}>
                            {child.label}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-right">
          {settings.headerCtaLabel && (
            <a href={settings.headerCtaUrl || '#contact'} className="btn btn-primary btn-sm">
              {settings.headerCtaLabel}
            </a>
          )}
          <button className="menu-toggle" aria-label="Menu">☰</button>
        </div>
      </div>
    </header>
  );
}
