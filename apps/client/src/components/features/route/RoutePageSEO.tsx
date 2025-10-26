import { useEffect } from 'react';
import { 
  getCityBySlug, 
  getRouteTitle, 
  getRouteDescription, 
  getRouteKeywords
} from '../../../data/popularRoutes';

interface RoutePageSEOProps {
  fromCity: string;
  toCity: string;
}

const RoutePageSEO = ({ fromCity, toCity }: RoutePageSEOProps) => {
  const fromCityData = getCityBySlug(fromCity);
  const toCityData = getCityBySlug(toCity);
  
  useEffect(() => {
    // Update document title and meta tags
    const title = getRouteTitle(fromCity, toCity);
    const description = getRouteDescription(fromCity, toCity);
    const keywords = getRouteKeywords(fromCity, toCity);
    
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://edistanta.ro/ruta/${fromCity}-${toCity}`);
    }
    
    // Update Twitter Card tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
    
    // Add structured data for the route
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TravelAction",
      "name": title,
      "description": description,
      "fromLocation": {
        "@type": "Place",
        "name": fromCityData?.name,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "RO",
          "addressRegion": fromCityData?.county
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": fromCityData?.coordinates[0],
          "longitude": fromCityData?.coordinates[1]
        }
      },
      "toLocation": {
        "@type": "Place",
        "name": toCityData?.name,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "RO",
          "addressRegion": toCityData?.county
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": toCityData?.coordinates[0],
          "longitude": toCityData?.coordinates[1]
        }
      },
      "provider": {
        "@type": "Organization",
        "name": "eDistanta",
        "url": "https://edistanta.ro"
      }
    };
    
    // Remove existing structured data script
    const existingScript = document.querySelector('script[type="application/ld+json"][data-route]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-route', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    // Route loading is now handled by SearchComponent
  }, [fromCity, toCity, fromCityData, toCityData]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Reset to default title and meta tags when component unmounts
      document.title = 'eDistanta';
      
      const defaultDescription = "Planifica rutele tale cu cele mai bune preturi la combustibil din Romania. eDistanta iti ofera informatii actualizate despre benzinarii si te ajuta sa economisesti bani la carburant.";
      const defaultKeywords = "rute, combustibil, benzinarii, preturi carburant, Romania, economii, planificare rute, GPS, navigatie";
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', defaultDescription);
      }
      
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', defaultKeywords);
      }
      
      // Remove route structured data
      const routeScript = document.querySelector('script[type="application/ld+json"][data-route]');
      if (routeScript) {
        routeScript.remove();
      }
    };
  }, []);
  
  if (!fromCityData || !toCityData) {
    return null;
  }
  
  return (
    <div className="sr-only">
      {/* Hidden content for SEO - screen reader only */}
      <h1>Distanța rutieră {fromCityData.name} - {toCityData.name}</h1>
      <p>
        Calculează distanța rutieră între {fromCityData.name} ({fromCityData.county}) 
        și {toCityData.name} ({toCityData.county}). 
        Găsește cea mai bună rută, timpul de călătorie estimat, 
        consumul de combustibil și costurile totale de călătorie.
      </p>
      <p>
        Informații actualizate despre prețurile carburantului la benzinăriile 
        din România pentru a-ți optimiza costurile de călătorie.
      </p>
    </div>
  );
};

export default RoutePageSEO;
