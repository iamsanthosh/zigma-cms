import { getMenu, getSiteSettings, getActiveTheme } from '@/lib/content';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { ThemeProvider } from '@/components/site/ThemeProvider';

export const revalidate = process.env.NODE_ENV === 'production' ? 60 : 1; // ISR: re-fetch content-driven chrome at most once a minute (1s in dev for faster feedback)

export default async function SiteLayout({ children }) {
  const [primaryNav, footerCompany, footerCapabilities, settings, activeTheme] = await Promise.all([
    getMenu('main-nav'),
    getMenu('footer-company'),
    getMenu('footer-capabilities'),
    getSiteSettings(),
    getActiveTheme()
  ]);

  // Build CSS from active theme settings
  let themeCss = '';
  let componentCss = '';
  
  if (activeTheme && activeTheme.settings) {
    // CSS variables from theme settings
    themeCss = `:root{${activeTheme.settings.map((t) => `${t.key}:${t.value};`).join('')}}`;
  }
  
  // Component-specific styles from theme
  if (activeTheme && activeTheme.componentStyles && activeTheme.componentStyles.length) {
    componentCss = activeTheme.componentStyles.map((style) => {
      const selector = style.selector || `.${style.component}`;
      return `${selector}{${style.property}:${style.value};}`;
    }).join('');
  }

  return (
    <ThemeProvider initialTheme={activeTheme}>
      {/* Use new theme CSS endpoint */}
      <link 
        rel="stylesheet" 
        href={`/api/public/theme/css?themeId=${activeTheme?.id || 1}`}
      />
      {themeCss && <style id="theme-overrides" dangerouslySetInnerHTML={{ __html: themeCss }} />}
      {componentCss && <style id="component-overrides" dangerouslySetInnerHTML={{ __html: componentCss }} />}
      <Header nav={primaryNav} settings={settings} themeMedia={activeTheme?.media} />
      <main>{children}</main>
      <Footer companyMenu={footerCompany} capabilitiesMenu={footerCapabilities} settings={settings} />
      <a href={(settings?.whatsappUrl) || '#'} className="float-wa" aria-label="Chat on WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3C8.6 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm5.2 14.3c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.7.8 2 1 .3.1.5.2.6.3.1.2.1.9-.1 1.5z" />
        </svg>
      </a>
      <div className="sticky-mobile-cta">
        <a href={`tel:${settings?.phone || ''}`} className="call">Call Now</a>
        <a href="#contact" className="quote">Get Quote</a>
      </div>
    </ThemeProvider>
  );
}
