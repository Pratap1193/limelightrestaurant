import { SEOSettings } from '../types';

/**
 * SEO Manager Utility
 * Handles client-side meta tag updates for dynamic SEO content
 */

export class SEOManager {
  /**
   * Update document title
   */
  static updateTitle(title: string) {
    if (title) {
      document.title = title;
    }
  }

  /**
   * Update or create a meta tag
   */
  static updateMetaTag(name: string, content: string) {
    if (!content) return;

    let element = document.querySelector(`meta[name="${name}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', name);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  }

  /**
   * Update or create a property meta tag (og:, twitter:, etc)
   */
  static updatePropertyMetaTag(property: string, content: string) {
    if (!content) return;

    let element = document.querySelector(`meta[property="${property}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  }

  /**
   * Update or create canonical link
   */
  static updateCanonicalUrl(url: string) {
    if (!url) return;

    let element = document.querySelector('link[rel="canonical"]');
    
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', 'canonical');
      document.head.appendChild(element);
    }
    
    element.setAttribute('href', url);
  }

  /**
   * Update Google Search Console verification meta tag
   */
  static updateGoogleSearchConsoleVerification(verificationCode: string) {
    if (!verificationCode) return;

    this.updateMetaTag('google-site-verification', verificationCode);
  }

  /**
   * Apply all SEO settings to the document head
   */
  static applySEOSettings(seo: SEOSettings) {
    // Update title
    this.updateTitle(seo.metaTitle);

    // Update standard meta tags
    this.updateMetaTag('description', seo.metaDescription);
    this.updateMetaTag('keywords', seo.metaKeywords);

    // Update Google Search Console verification
    this.updateGoogleSearchConsoleVerification(seo.googleSearchConsoleId);

    // Update canonical URL
    this.updateCanonicalUrl(seo.canonicalUrl);

    // Update Open Graph tags (optional but good for social sharing)
    this.updatePropertyMetaTag('og:title', seo.metaTitle);
    this.updatePropertyMetaTag('og:description', seo.metaDescription);
    this.updatePropertyMetaTag('og:url', seo.canonicalUrl);
    this.updatePropertyMetaTag('og:type', 'website');

    // Update Twitter Card tags
    this.updatePropertyMetaTag('twitter:title', seo.metaTitle);
    this.updatePropertyMetaTag('twitter:description', seo.metaDescription);
    this.updatePropertyMetaTag('twitter:card', 'summary_large_image');
  }

  /**
   * Get current SEO tags from document head
   */
  static getCurrentSEOSettings(): Partial<SEOSettings> {
    return {
      metaTitle: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      metaKeywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
      canonicalUrl: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      googleSearchConsoleId: document.querySelector('meta[name="google-site-verification"]')?.getAttribute('content') || '',
    };
  }
}

export default SEOManager;
