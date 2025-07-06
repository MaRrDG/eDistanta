import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom start marker icon
const startIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzIwNjNlYiIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNTQgMjIuMzUxbC4wNy4wNC4wMjguMDE2YS43Ni43NiAwIDAwLjcyMyAwbC4wMjgtLjAxNS4wNzEtLjA0MWExNi45NzUgMTYuOTc1IDAgMDAxLjE0NC0uNzQyIDE5LjU4IDE5LjU4IDAgMDAyLjY4My0yLjI4MmMxLjk0NC0xLjk5IDMuOTYzLTQuOTggMy45NjMtOC44MjdhOC4yNSA4LjI1IDAgMDAtMTYuNSAwYzAgMy44NDYgMi4wMiA2LjgzNyAzLjk2MyA4LjgyN2ExOS41OCAxOS41OCAwIDAwMi42ODIgMi4yODIgMTYuOTc1IDE2Ljk3NSAwIDAwMS4xNDUuNzQyek0xMiAxMy41YTMgMyAwIDEwMC02IDMgMyAwIDAwMCA2eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==',
  shadowUrl: iconShadow,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42],
});

// Custom end marker icon
const endIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzE2YTM0YSIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTEuNTQgMjIuMzUxbC4wNy4wNC4wMjguMDE2YS43Ni43NiAwIDAwLjcyMyAwbC4wMjgtLjAxNS4wNzEtLjA0MWExNi45NzUgMTYuOTc1IDAgMDAxLjE0NC0uNzQyIDE5LjU4IDE5LjU4IDAgMDAyLjY4My0yLjI4MmMxLjk0NC0xLjk5IDMuOTYzLTQuOTggMy45NjMtOC44MjdhOC4yNSA4LjI1IDAgMDAtMTYuNSAwYzAgMy44NDYgMi4wMiA2LjgzNyAzLjk2MyA4LjgyN2ExOS41OCAxOS41OCAwIDAwMi42ODIgMi4yODIgMTYuOTc1IDE2Ljk3NSAwIDAwMS4xNDUuNzQyek0xMiAxMy41YTMgMyAwIDEwMC02IDMgMyAwIDAwMCA2eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==',
  shadowUrl: iconShadow,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42],
});

// Default marker for other points
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Center coordinates for Romania
const ROMANIA_CENTER: [number, number] = [45.9443, 25.0094];
const DEFAULT_ZOOM = 7;

// Route colors for alternatives
const ROUTE_COLORS = ['#2563eb', '#9333ea', '#16a34a', '#f59e0b'];

interface RouteData {
  route: [number, number][];
  distance: number;
  duration: number;
  index: number;
}

interface MapComponentProps {
  startLocation: [number, number] | null;
  endLocation: [number, number] | null;
  routes: RouteData[] | null;
  selectedRouteIndex: number;
  onRouteSelected?: (index: number) => void;
}

// Map controller component to handle map initialization
const MapController = ({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) => {
  const map = useMap();
  
  useEffect(() => {
    mapRef.current = map;
    
    // Enable all zoom and pan options
    map.scrollWheelZoom.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.dragging.enable();
    
    // Fix for mobile browsers to prevent page scrolling when interacting with map
    const container = map.getContainer();
    
    // Prevent page scrolling when interacting with the map
    const preventScroll = (e: Event) => {
      if (e.target === container || container.contains(e.target as Node)) {
        e.preventDefault();
      }
    };
    
    // Only add these listeners on mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      document.addEventListener('touchmove', preventScroll, { passive: false });
      
      return () => {
        document.removeEventListener('touchmove', preventScroll);
      };
    }
  }, [map, mapRef]);
  
  return null;
};

const MapComponent = ({ startLocation, endLocation, routes, selectedRouteIndex, onRouteSelected }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  // Fit map to route bounds when route changes
  useEffect(() => {
    if (mapRef.current && routes && routes.length > 0) {
      setIsLoading(true);
      
      try {
        // Get the selected route
        const selectedRoute = routes[selectedRouteIndex].route;
        
        const bounds = L.latLngBounds(selectedRoute.map(coord => L.latLng(coord[0], coord[1])));
        mapRef.current.fitBounds(bounds, { 
          padding: [50, 50],
          animate: true,
          duration: 0.5 
        });
        
        // Add a small delay to allow the map to finish animating
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      } catch (err) {
        console.error("Error fitting bounds:", err);
        setIsLoading(false);
      }
    }
  }, [routes, selectedRouteIndex]);

  const handleRouteClick = (index: number) => {
    if (onRouteSelected) {
      onRouteSelected(index);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <MapContainer
        center={ROMANIA_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        zoomControl={false}
        className="z-0"
        attributionControl={false}
        scrollWheelZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
      >
        <MapController mapRef={mapRef} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ZoomControl position="bottomright" />
        
        {startLocation && (
          <Marker position={startLocation} icon={startIcon}>
            <Popup className="custom-popup">
              <div className="font-medium">{t('map.startLocation')}</div>
            </Popup>
          </Marker>
        )}
        
        {endLocation && (
          <Marker position={endLocation} icon={endIcon}>
            <Popup className="custom-popup">
              <div className="font-medium">{t('map.destination')}</div>
            </Popup>
          </Marker>
        )}
        
        {routes && routes.length > 0 && routes.map((routeData, index) => (
          <Polyline 
            key={index}
            positions={routeData.route}
            pathOptions={{
              color: ROUTE_COLORS[index % ROUTE_COLORS.length],
              weight: selectedRouteIndex === index ? 5 : 3,
              opacity: selectedRouteIndex === index ? 0.8 : 0.5,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: selectedRouteIndex === index ? '0' : '5, 5',
            }}
            eventHandlers={{
              click: () => handleRouteClick(index)
            }}
          />
        ))}
      </MapContainer>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <svg className="animate-spin h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-blue-800 font-medium">{t('map.loadingRoute')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent; 