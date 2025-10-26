import { AppLayout } from '../components/layout';
import { RouteDetailsProvider } from '../contexts/RouteDetailsContext';
import { AppStateProvider } from '../contexts/AppStateContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';

const HomePage = () => {
  return (
    <AppStateProvider>
      <RouteDetailsProvider>
        <FavoritesProvider>
          <AppLayout />
        </FavoritesProvider>
      </RouteDetailsProvider>
    </AppStateProvider>
  );
};

export default HomePage;
