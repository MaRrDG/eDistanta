import { useParams } from 'react-router-dom';
import NotFoundPage from '@ui/components/NotFoundPage';
import { RoutePageSEO } from '@ui/components/features/route';
import { parseRouteSlug } from '@data/popularRoutes';
import { useRouteFromUrl } from '@ui/hooks/useRouteFromUrl';
import { RouteDetailsProvider } from '@contexts/RouteDetailsContext';
import { AppStateProvider } from '@contexts/AppStateContext';
import { FavoritesProvider } from '@contexts/FavoritesContext';
import { AppLayout } from '@ui/components/layout';

const RoutePage = () => {
  const { routeSlug } = useParams<{ routeSlug: string }>();
  const routeData = routeSlug ? parseRouteSlug(routeSlug) : null;

  const {
    startInput: initialStartInput,
    endInput: initialEndInput,
    startLocation: initialStartLocation,
    endLocation: initialEndLocation,
  } = useRouteFromUrl(routeData?.from, routeData?.to);

  if (!routeData) {
    return <NotFoundPage />;
  }

  return (
    <>
      <RoutePageSEO
        fromCity={routeData.from}
        toCity={routeData.to}
      />
      <AppStateProvider
        initialStartInput={initialStartInput}
        initialEndInput={initialEndInput}
        initialStartLocation={initialStartLocation}
        initialEndLocation={initialEndLocation}
      >
        <RouteDetailsProvider>
          <FavoritesProvider>
            <AppLayout
              initialStartInput={initialStartInput}
              initialEndInput={initialEndInput}
            />
          </FavoritesProvider>
        </RouteDetailsProvider>
      </AppStateProvider>
    </>
  );
};

export default RoutePage;
