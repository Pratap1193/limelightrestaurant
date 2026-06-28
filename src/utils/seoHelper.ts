import { SEOSettings } from '../types';

/**
 * Updates all SEO meta tags in the HTML head
 * This ensures view-source shows the correct SEO tags immediately
 */
export function updateSEOTags(seo: SEOSettings) {
  // Update or create title tag
  document.title = seo.metaTitle;

  // Update or create meta description
  updateMetaTag('description', seo.metaDescription);

  // Update or create meta keywords
  updateMetaTag('keywords', seo.metaKeywords);

  // Update or create canonical link
  updateCanonicalTag(seo.canonicalUrl);

  // Update or create Google Search Console verification
  if (seo.googleSearchConsoleId) {
    updateMetaTag('google-site-verification', seo.googleSearchConsoleId);
  }

  // Update or create Google Analytics tag
  if (seo.googleAnalyticsId && seo.googleAnalyticsId !== 'G-XXXXXXXXXX') {
    injectGoogleAnalyticsScript(seo.googleAnalyticsId);
  }
}

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(name: string, content: string) {
  let metaTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;

  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('name', name);
    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute('content', content);
}

/**
 * Update or create canonical link tag
 */
function updateCanonicalTag(canonicalUrl: string) {
  let linkTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!linkTag) {
    linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'canonical');
    document.head.appendChild(linkTag);
  }

  linkTag.setAttribute('href', canonicalUrl);
}

/**
 * Inject or update Google Analytics script
 */
function injectGoogleAnalyticsScript(googleAnalyticsId: string) {
  // Check if script already exists
  let script = document.querySelector(`script[src*="gtag/js?id=${googleAnalyticsId}"]`) as HTMLScriptElement;

  if (!script) {
    script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(script);

    // Add inline gtag configuration
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsId}');
    `;
    document.head.appendChild(configScript);
  }
}

/**
 * Get all current SEO tags for debugging/verification
 */
export function getSEOTagsForDebug() {
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content'),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    googleSearchConsole: document.querySelector('meta[name="google-site-verification"]')?.getAttribute('content'),
  };
}
