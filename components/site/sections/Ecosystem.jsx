export default function Ecosystem({ data, backgroundStyle }) {
  const themeClass = backgroundStyle ? `theme-${backgroundStyle}` : '';

  return (
    <section className={`ecosystem-section ${themeClass}`}>
      <div className="container">
        <div className="eco-wrap">
          <div className="eco-visual">
            <svg viewBox="0 0 500 480" className="eco-svg">
              {/* Connecting flow lines */}
              <g className="eco-connections">
                <line x1="250" y1="70" x2="400" y2="165" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                <line x1="250" y1="70" x2="400" y2="335" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                <line x1="250" y1="70" x2="250" y2="410" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                <line x1="250" y1="70" x2="100" y2="335" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                <line x1="250" y1="70" x2="100" y2="165" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
              </g>
              
              {/* Hub */}
              <circle cx="250" cy="250" r="60" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
              <circle cx="250" cy="250" r="40" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
              
              {/* Nodes */}
              <g className="eco-node eco-pulse">
                <circle cx="250" cy="70" r="30" fill="rgba(10,22,40,0.9)" stroke="var(--green)" strokeWidth="1.6"/>
                <path d="M250 58v-8M240 70h-8M260 70h8M243 63l-6-6M257 77l6 6M243 77l-6 6M257 63l6-6" stroke="var(--green)" strokeWidth="1.4"/>
                <circle cx="250" cy="70" r="6" fill="none" stroke="var(--green)" strokeWidth="1.4"/>
                <text x="250" y="115" textAnchor="middle" fontSize="11" fill="#B7C2D6">Solar Energy</text>
              </g>
              
              <g className="eco-node eco-pulse" style={{animationDelay: '0.3s'}}>
                <circle cx="400" cy="165" r="30" fill="rgba(10,22,40,0.9)" stroke="var(--orange)" strokeWidth="1.6"/>
                <path d="M403 152l-11 18h13l-11 18" stroke="var(--orange)" strokeWidth="1.8" fill="none"/>
                <text x="400" y="210" textAnchor="middle" fontSize="11" fill="#B7C2D6">Power Backup</text>
              </g>
              
              <g className="eco-node eco-pulse" style={{animationDelay: '0.6s'}}>
                <circle cx="400" cy="335" r="30" fill="rgba(10,22,40,0.9)" stroke="var(--cyan)" strokeWidth="1.6"/>
                <circle cx="400" cy="335" r="8" fill="none" stroke="var(--cyan)" strokeWidth="1.4"/>
                <path d="M400 319v-6M400 351v6M384 335h-6M416 335h6" stroke="var(--cyan)" strokeWidth="1.4"/>
                <text x="400" y="380" textAnchor="middle" fontSize="11" fill="#B7C2D6">Automation</text>
              </g>
              
              <g className="eco-node eco-pulse" style={{animationDelay: '0.9s'}}>
                <circle cx="250" cy="410" r="30" fill="rgba(10,22,40,0.9)" stroke="var(--green)" strokeWidth="1.6"/>
                <path d="M250 396c10 0 16 8 14 18-10 2-18-4-18-14-2 6 0 12 4 16" stroke="var(--green)" strokeWidth="1.4" fill="none"/>
                <text x="250" y="455" textAnchor="middle" fontSize="11" fill="#B7C2D6">Sustainable Power</text>
              </g>
              
              <g className="eco-node eco-pulse" style={{animationDelay: '1.2s'}}>
                <circle cx="100" cy="335" r="30" fill="rgba(10,22,40,0.9)" stroke="var(--cyan)" strokeWidth="1.6"/>
                <path d="M100 319l6 6M100 351l-6 6M84 335h6M116 335h6" stroke="var(--cyan)" strokeWidth="1.4"/>
                <text x="100" y="380" textAnchor="middle" fontSize="11" fill="#B7C2D6">Electrical Eng</text>
              </g>
              
              <g className="eco-node eco-pulse" style={{animationDelay: '1.5s'}}>
                <circle cx="100" cy="165" r="30" fill="rgba(10,22,40,0.9)" stroke="var(--orange)" strokeWidth="1.6"/>
                <path d="M100 149v6M100 181v6M84 165h6M116 165h6M100 155l-4 4M100 175l4 4" stroke="var(--orange)" strokeWidth="1.4"/>
                <text x="100" y="210" textAnchor="middle" fontSize="11" fill="#B7C2D6">Energy Dist</text>
              </g>
            </svg>
          </div>
          
          <div className="eco-text">
            {data.eyebrow && <div className="eyebrow eyebrow-orange">{data.eyebrow}</div>}
            {data.heading && <h2>{data.heading}</h2>}
            {data.body && <p>{data.body}</p>}
            
            {data.capabilities && data.capabilities.length > 0 && (
              <div className="cap-checklist">
                {data.capabilities.map((cap, i) => (
                  <div key={i} className="cap-check">
                    <span className={`dot dot-${cap.color || 'orange'}`}></span>
                    {cap.label}
                  </div>
                ))}
              </div>
            )}
            
            {(data.badgeText || data.badgeLabel) && (
              <div className="mini-trust">
                <div className="mstat">
                  {data.badgeText && <span className="badge-iso">{data.badgeText}</span>}
                  {data.badgeLabel && <div className="lbl" style={{marginTop: '0.4rem'}}>{data.badgeLabel}</div>}
                </div>
              </div>
            )}
            
            {data.ctaLabel && (
              <a href={data.ctaUrl || '#'} className="btn btn-primary">
                {data.ctaLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
