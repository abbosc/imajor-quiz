export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://imajor.app/#website",
        "url": "https://imajor.app",
        "name": "iMajor",
        "description": "Discover your perfect college major with our exploration quiz",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://imajor.app/quiz",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://imajor.app/#organization",
        "name": "iMajor",
        "url": "https://imajor.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://imajor.app/logo.png"
        },
        "sameAs": []
      },
      {
        "@type": "WebPage",
        "@id": "https://imajor.app/#webpage",
        "url": "https://imajor.app",
        "name": "iMajor - Discover Your Perfect College Major",
        "isPartOf": { "@id": "https://imajor.app/#website" },
        "about": { "@id": "https://imajor.app/#organization" },
        "description": "Take the free Major Exploration Quiz to discover how deeply you've explored your college major options. Win free consultation slots with expert mentors!"
      },
      {
        "@type": "Quiz",
        "name": "Major Exploration Depth Quiz",
        "description": "Discover how deeply you've explored your college major options and find your ideal career path",
        "url": "https://imajor.app/quiz",
        "provider": {
          "@type": "Organization",
          "name": "iMajor"
        },
        "educationalLevel": "High School / College",
        "about": {
          "@type": "Thing",
          "name": "College Major Selection"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
