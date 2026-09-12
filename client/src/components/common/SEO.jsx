import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reusable SEO component for dynamic head metadata and schema injection.
 * Works seamlessly without third-party dependencies.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage = 'https://urugendo.rw/images/logo1.png',
  schema,
  noIndex = false,
}) {
  const location = useLocation();

  useEffect(() => {
    const siteUrl = 'https://urugendo.rw';
    const currentUrl = canonical
      ? (canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`)
      : `${siteUrl}${location.pathname}`;

    const formattedTitle = title
      ? (title.includes('Urugendo') ? title : `${title} · Urugendo Rwanda`)
      : "Urugendo — Master Rwandan Traffic Rules & Provisional Driving Exam";

    const defaultDesc =
      "Study Rwandan traffic rules (Amategeko y'Umuhanda), road signs, practice questions, and timed mock tests for your provisional driving license. Accessible, bilingual in Kinyarwanda & English.";
    const metaDesc = description || defaultDesc;

    const defaultKeywords =
      "amategeko y'umuhanda, rwanda traffic rules, provisional driving license rwanda, uruhushya rw'agateganyo, rwanda road signs, ibyapa byo mu muhanda, rnp driving test, irembo driving license, urugendo";
    const metaKeywords = keywords || defaultKeywords;

    // 1. Update Title
    document.title = formattedTitle;

    // Helper to update or create a meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create a link tag
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', metaDesc);
    setMetaTag('name', 'keywords', metaKeywords);
    setMetaTag(
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    );

    // 3. Canonical Link
    setLinkTag('canonical', currentUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', metaDesc);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'Urugendo');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', metaDesc);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data Schema
    let scriptTag = document.getElementById('page-jsonld-schema');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'page-jsonld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on unmount if needed
    };
  }, [title, description, keywords, canonical, ogType, ogImage, schema, noIndex, location.pathname]);

  return null;
}

