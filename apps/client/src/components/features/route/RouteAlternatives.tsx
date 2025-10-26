import { useTranslation } from 'react-i18next';

interface RouteData {
  route: [number, number][];
  distance: number;
  duration: number;
  index: number;
}

interface RouteAlternativesProps {
  routes: RouteData[];
  selectedRouteIndex: number;
  onRouteSelected: (index: number) => void;
}

const ROUTE_COLORS = ['#2563eb', '#9333ea', '#16a34a', '#f59e0b'];

const RouteAlternatives = ({ routes, selectedRouteIndex, onRouteSelected }: RouteAlternativesProps) => {
  const { t } = useTranslation();

  if (routes.length <= 1) {
    return null;
  }

  return (
    <div className="mb-4 px-4 md:px-0">
      <p className="text-sm text-slate-800 mb-2">
        {t('routeDetails.alternatives')}
      </p>
      <div className="flex flex-wrap gap-2">
        {routes.map((route, index) => {
          const routeHours = Math.floor(route.duration / 60);
          const routeMinutes = Math.round(route.duration % 60);
          const routeDuration =
            routeHours > 0
              ? `${routeHours}${t('units.hour')} ${routeMinutes}${t('units.min')}`
              : `${routeMinutes}${t('units.min')}`;

          return (
            <button
              key={index}
              onClick={() => onRouteSelected(index)}
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                selectedRouteIndex === index
                  ? 'bg-slate-100 border border-slate-300'
                  : 'bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor: ROUTE_COLORS[index % ROUTE_COLORS.length],
                }}
              ></span>
              <span className="font-medium">
                {t('routeDetails.route')} {index + 1}
              </span>
              <span className="mx-1.5 text-slate-600">•</span>
              <span className="text-slate-800">{routeDuration}</span>
              <span className="mx-1.5 text-slate-600">•</span>
              <span className="text-slate-800">
                {route.distance.toFixed(1)} {t('units.km')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RouteAlternatives;
