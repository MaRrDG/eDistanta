import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormEvent } from 'react';

interface SearchComponentProps {
  onRouteCalculated: (
    startLocation: [number, number],
    endLocation: [number, number],
    route: [number, number][],
    distance: number,
    duration: number
  ) => void;
}

interface City {
  name: string;
  coordinates: [number, number];
}

interface RouteResponse {
  routes: {
    geometry: {
      coordinates: [number, number][];
    };
    distance: number;
    duration: number;
  }[];
}

const SearchComponent = ({ onRouteCalculated }: SearchComponentProps) => {
  const { t } = useTranslation();
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [startSuggestions, setStartSuggestions] = useState<City[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<City[]>([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Romanian cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        // Normally we would fetch from an API, but for this example we'll use a static list
        // In a real app, you would replace this with an API call like:
        // const response = await fetch('https://api.example.com/romanian-cities');
        // const data = await response.json();
        
        // For now, using a more comprehensive list of Romanian cities
        const romanianCities: City[] = [
          { name: 'Bucharest', coordinates: [44.4268, 26.1025] },
          { name: 'Cluj-Napoca', coordinates: [46.7712, 23.6236] },
          { name: 'Timișoara', coordinates: [45.7489, 21.2087] },
          { name: 'Iași', coordinates: [47.1585, 27.6014] },
          { name: 'Constanța', coordinates: [44.1598, 28.6348] },
          { name: 'Craiova', coordinates: [44.3190, 23.7965] },
          { name: 'Brașov', coordinates: [45.6427, 25.5887] },
          { name: 'Galați', coordinates: [45.4353, 28.0480] },
          { name: 'Ploiești', coordinates: [44.9469, 26.0365] },
          { name: 'Oradea', coordinates: [47.0465, 21.9189] },
          { name: 'Brăila', coordinates: [45.2692, 27.9575] },
          { name: 'Arad', coordinates: [46.1866, 21.3123] },
          { name: 'Pitești', coordinates: [44.8565, 24.8692] },
          { name: 'Sibiu', coordinates: [45.7983, 24.1469] },
          { name: 'Bacău', coordinates: [46.5670, 26.9146] },
          { name: 'Târgu Mureș', coordinates: [46.5455, 24.5577] },
          { name: 'Baia Mare', coordinates: [47.6567, 23.5850] },
          { name: 'Buzău', coordinates: [45.1500, 26.8167] },
          { name: 'Satu Mare', coordinates: [47.7927, 22.8850] },
          { name: 'Botoșani', coordinates: [47.7485, 26.6694] },
          { name: 'Râmnicu Vâlcea', coordinates: [45.1047, 24.3756] },
          { name: 'Suceava', coordinates: [47.6635, 26.2732] },
          { name: 'Piatra Neamț', coordinates: [46.9275, 26.3715] },
          { name: 'Drobeta-Turnu Severin', coordinates: [44.6258, 22.6567] },
          { name: 'Târgu Jiu', coordinates: [45.0333, 23.2833] },
          { name: 'Tulcea', coordinates: [45.1667, 28.8000] },
          { name: 'Reșița', coordinates: [45.3000, 21.8833] },
          { name: 'Bistrița', coordinates: [47.1333, 24.5000] },
          { name: 'Slatina', coordinates: [44.4333, 24.3667] },
          { name: 'Alba Iulia', coordinates: [46.0667, 23.5833] },
          { name: 'Focșani', coordinates: [45.7000, 27.1833] },
          { name: 'Târgoviște', coordinates: [44.9333, 25.4667] },
          { name: 'Bârlad', coordinates: [46.2333, 27.6667] },
          { name: 'Vaslui', coordinates: [46.6333, 27.7333] },
          { name: 'Giurgiu', coordinates: [43.9000, 25.9667] },
          { name: 'Hunedoara', coordinates: [45.7667, 22.9000] },
          { name: 'Roman', coordinates: [46.9333, 26.9167] },
          { name: 'Deva', coordinates: [45.8833, 22.9000] },
          { name: 'Slobozia', coordinates: [44.5667, 27.3667] },
          { name: 'Câmpina', coordinates: [45.1333, 25.7333] }
        ];
        
        setCities(romanianCities);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('Failed to load cities. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleSearch = (input: string, isStart: boolean) => {
    if (!input.trim()) {
      isStart ? setStartSuggestions([]) : setEndSuggestions([]);
      isStart ? setShowStartSuggestions(false) : setShowEndSuggestions(false);
      return;
    }
    
    const filteredCities = cities.filter(city => 
      city.name.toLowerCase().includes(input.toLowerCase())
    );
    
    if (isStart) {
      setStartSuggestions(filteredCities);
      setShowStartSuggestions(true);
    } else {
      setEndSuggestions(filteredCities);
      setShowEndSuggestions(true);
    }
  };

  const selectCity = (city: City, isStart: boolean) => {
    if (isStart) {
      setStartInput(city.name);
      setShowStartSuggestions(false);
    } else {
      setEndInput(city.name);
      setShowEndSuggestions(false);
    }
  };

  const calculateRoute = async (
    startCoords: [number, number],
    endCoords: [number, number]
  ): Promise<{
    route: [number, number][];
    distance: number;
    duration: number;
  }> => {
    try {
      // Using OSRM API for route calculation
      // In a production app, you would want to use your own hosted OSRM instance or a commercial API
      const startLng = startCoords[1];
      const startLat = startCoords[0];
      const endLng = endCoords[1];
      const endLat = endCoords[0];
      
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data: RouteResponse = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }
      
      const route = data.routes[0];
      
      // OSRM returns coordinates as [longitude, latitude], but our app uses [latitude, longitude]
      const formattedRoute = route.geometry.coordinates.map(
        coord => [coord[1], coord[0]] as [number, number]
      );
      
      // Convert distance from meters to kilometers
      const distanceInKm = route.distance / 1000;
      
      // Convert duration from seconds to minutes
      const durationInMinutes = route.duration / 60;
      
      return {
        route: formattedRoute,
        distance: distanceInKm,
        duration: durationInMinutes
      };
    } catch (error) {
      console.error('Error calculating route:', error);
      throw new Error('Failed to calculate route. Please try again.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCalculating(true);
    
    try {
      const startCity = cities.find(city => 
        city.name.toLowerCase() === startInput.toLowerCase()
      );
      
      const endCity = cities.find(city => 
        city.name.toLowerCase() === endInput.toLowerCase()
      );
      
      if (!startCity || !endCity) {
        setError(t('search.validationError'));
        setIsCalculating(false);
        return;
      }
      
      // Calculate the fastest road route using the API
      const routeData = await calculateRoute(
        startCity.coordinates,
        endCity.coordinates
      );
      
      onRouteCalculated(
        startCity.coordinates,
        endCity.coordinates,
        routeData.route,
        routeData.distance,
        routeData.duration
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-medium text-blue-900 mb-4">{t('search.title')}</h2>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-blue-800">{t('search.loadingCities')}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="flex items-center mb-1.5">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
              </div>
              <label htmlFor="start" className="text-sm font-medium text-slate-700">
                {t('search.startLocation')}
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="start"
                value={startInput}
                onChange={(e) => {
                  setStartInput(e.target.value);
                  handleSearch(e.target.value, true);
                }}
                onFocus={() => startInput && setShowStartSuggestions(true)}
                placeholder={t('search.enterStartLocation')}
                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              />
              {showStartSuggestions && startSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-blue-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                  {startSuggestions.map((city, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-slate-700"
                      onClick={() => selectCity(city, true)}
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center mb-1.5">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
              </div>
              <label htmlFor="destination" className="text-sm font-medium text-slate-700">
                {t('search.destination')}
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="destination"
                value={endInput}
                onChange={(e) => {
                  setEndInput(e.target.value);
                  handleSearch(e.target.value, false);
                }}
                onFocus={() => endInput && setShowEndSuggestions(true)}
                placeholder={t('search.enterDestination')}
                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              />
              {showEndSuggestions && endSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-blue-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                  {endSuggestions.map((city, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-slate-700"
                      onClick={() => selectCity(city, false)}
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isCalculating || !startInput || !endInput}
            className={`w-full py-2.5 px-4 rounded-md font-medium text-white ${
              isCalculating || !startInput || !endInput
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors flex items-center justify-center`}
          >
            {isCalculating ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('search.calculatingRoute')}
              </>
            ) : (
              t('search.calculateRoute')
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default SearchComponent; 