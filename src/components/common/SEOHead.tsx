import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'LuxeHome - Premium Home & Lifestyle',
  description = 'Discover premium home decor, furniture, and lifestyle products at LuxeHome. Quality craftsmanship meets modern design.',
  keywords = 'home decor, furniture, lifestyle, premium, luxury, design',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  noindex = false,
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
    
    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:site_name" content="LuxeHome" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={url} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    
    <link rel="canonical" href={url} />
    
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "LuxeHome",
        "url": "https://luxehome.com",
        "logo": "https://luxehome.com/logo.png",
        "description": description,
        "sameAs": ["https://facebook.com/luxehome", "https://twitter.com/luxehome", "https://instagram.com/luxehome"]
      })}
    </script>
  </Helmet>
);

export default SEOHead;
