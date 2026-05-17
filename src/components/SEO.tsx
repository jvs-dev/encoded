import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
}

export function SEO({ 
  title = "INCODED | Agência de Elite em Transformação Digital", 
  description = "Acelere seu crescimento com soluções digitais avançadas. Criação de sites, sistemas web sob medida e inteligência artificial.",
  keywords = "agência digital, desenvolvimento web, sites, landing pages, IA, automação",
  url = "https://incoded.com.br",
  image = "/logo.svg" 
}: SEOProps) {
  const fullTitle = title.includes("INCODED") ? title : `${title} | INCODED`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
