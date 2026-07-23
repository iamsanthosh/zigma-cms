export default function Footer({ companyMenu, capabilitiesMenu, settings }) {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div>
            <a href="/" className="logo footer-logo">
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
            <p style={{ fontSize: '0.85rem', maxWidth: 280, marginTop: '1rem' }}>
              {settings.footerTagline ||
                "Engineering power infrastructure for Indian industry since 2006 — Solar EPC, Industrial UPS, Battery Solutions, and 24×7 AMC."}
            </p>
            {settings.newsletterEnabled !== false && (
              <div className="newsletter-form">
                <input type="email" placeholder="Your email" aria-label="Email for newsletter" />
                <button>Subscribe</button>
              </div>
            )}
          </div>

          <div>
            <h6>{companyMenu?.label || 'Company'}</h6>
            {(companyMenu?.items || []).map((item) => (
              <a key={item.id} href={item.url}>
                {item.label}
              </a>
            ))}
          </div>

          <div>
            <h6>{capabilitiesMenu?.label || 'Capabilities'}</h6>
            {(capabilitiesMenu?.items || []).map((item) => (
              <a key={item.id} href={item.url}>
                {item.label}
              </a>
            ))}
          </div>

          <div>
            <h6>Contact</h6>
            {settings.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
            {settings.emergencyLabel && (
              <a href={settings.emergencyUrl || '#'} className="foot-emergency">
                {settings.emergencyLabel} →
              </a>
            )}
            <div className="social-links">
              {(settings.socialLinks || []).map((s, i) => (
                <a key={i} href={s.url} className={`sl-${s.platform?.slice(0, 2)}`} aria-label={s.platform}>
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>{settings.copyrightText || `© ${year} Zigma Technologies. All rights reserved.`}</span>
          <span className="foot-powered">
            {settings.footerPoweredByText || 'Powered by <strong>JustX Systems</strong>'}
          </span>
          <span className="foot-legal">
            <a href={settings.privacyPolicyUrl || '/privacy-policy'}>Privacy Policy</a>
            <a href={settings.termsUrl || '/terms'}>Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
