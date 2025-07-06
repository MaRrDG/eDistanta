import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import MapComponent from './components/MapComponent'
import SearchComponent from './components/SearchComponent'
import RouteDetails from './components/RouteDetails'
import LanguageSelector from './components/LanguageSelector'

function App() {
  const [startLocation, setStartLocation] = useState<[number, number] | null>(null)
  const [endLocation, setEndLocation] = useState<[number, number] | null>(null)
  const [route, setRoute] = useState<[number, number][] | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false)
  const { t } = useTranslation()

  const handleRouteCalculated = (
    start: [number, number],
    end: [number, number],
    routeData: [number, number][],
    distanceData: number,
    durationData: number
  ) => {
    setStartLocation(start)
    setEndLocation(end)
    setRoute(routeData)
    setDistance(distanceData)
    setDuration(durationData)
    setIsDetailsExpanded(true)
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Modern minimal header */}
      <header className="bg-white border-b border-blue-100 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600 mr-3">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <h1 className="text-xl font-semibold text-blue-800">{t('header.title')}</h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <button 
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen)
                setIsDetailsExpanded(false)
              }}
            className="md:hidden bg-blue-50 hover:bg-blue-100 p-2 rounded-full text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content with map focus */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar with search and route details */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 absolute md:relative z-10 w-80 h-[calc(100%-3.5rem)] md:h-auto bg-white border-r border-blue-100 shadow-lg md:shadow-none flex flex-col`}>
          <div className="p-4 flex-1 overflow-y-auto">
            <SearchComponent 
              onRouteCalculated={handleRouteCalculated} 
              onMobileSubmit={() => {
                // Only close the sidebar on mobile devices
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
            />
            {/* RouteDetails only shown in sidebar on medium screens and up */}
            <div className="hidden md:block">
              {(distance !== null && duration !== null) && (
                <RouteDetails distance={distance} duration={duration} />
              )}
            </div>
          </div>
          
          {/* Mobile close button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute top-2 right-2 bg-blue-50 hover:bg-blue-100 p-1 rounded-full text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map container - takes all available space */}
        <div className="flex-1 relative">
          <MapComponent 
            startLocation={startLocation}
            endLocation={endLocation}
            route={route}
          />
          
          {/* Mobile toggle button when sidebar is closed */}
          {!isSidebarOpen && (
            <button 
              onClick={() => {
                setIsSidebarOpen(true)
                setIsDetailsExpanded(false)
              }}
              className="md:hidden absolute top-4 left-4 z-10 bg-white shadow-lg p-3 rounded-full text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          )}
          
          {/* Bottom route details widget for mobile */}
          {distance !== null && duration !== null && (
            <div className={`md:hidden absolute bottom-0 left-0 right-0 bg-white shadow-lg transition-transform duration-300 z-10 ${isDetailsExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'}`}>
              <div 
                className="flex justify-between items-center px-4 py-2 border-b border-blue-100 cursor-pointer"
                onClick={() => {
                  const isExpanded = !isDetailsExpanded
                  setIsDetailsExpanded(isExpanded)

                  if (isExpanded) {
                    setIsSidebarOpen(false)
                  }
                }}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-blue-600">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <span className="font-medium text-blue-800">{t('routeDetails.title')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-600 mr-1">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{Math.floor(duration / 60)}{t('units.hour')} {Math.round(duration % 60)}{t('units.min')}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-600 mr-1">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{distance.toFixed(1)} {t('units.km')}</span>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className={`w-5 h-5 text-blue-600 transform transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`}
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                <RouteDetails distance={distance} duration={duration} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
