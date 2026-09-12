import React from 'react';
import Hero from '../components/hero/Hero';
import Marquee from '../components/sections/Marquee';
import WhoWeAre from '../components/sections/WhoWeAre';
import WhatWeOffer from '../components/sections/WhatWeOffer';
import FeatureHighlight from '../components/sections/FeatureHighlight';
import Testimonials from '../components/testimonials/Testimonials';
import FAQ from '../components/faq/FAQ';
import CTA from '../components/sections/CTA';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Urugendo',
        url: 'https://urugendo.rw',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://urugendo.rw/help?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Urugendo Education Rwanda',
        url: 'https://urugendo.rw',
        logo: 'https://urugendo.rw/images/logo1.png',
        description: t('seo.homeDesc'),
        sameAs: [
          'https://twitter.com/urugendo_rw',
          'https://instagram.com/urugendo_rw',
          'https://facebook.com/urugendo.rw',
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kigali',
          addressCountry: 'RW',
        },
      },
    ],
  };

  return (
    <>
      <SEO
        title={t('seo.homeTitle')}
        description={t('seo.homeDesc')}
        canonical="/"
        schema={homeSchema}
      />
      <Hero />
      <Marquee />
      <WhoWeAre />
      <WhatWeOffer />
      <FeatureHighlight />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
