import { AppLayout } from '../components/layout';
import { RouteDetailsProvider } from '../contexts/RouteDetailsContext';
import { AppStateProvider } from '../contexts/AppStateContext';

const HomePage = () => {
  return (
    <AppStateProvider>
      <RouteDetailsProvider>
        <AppLayout />
      </RouteDetailsProvider>
    </AppStateProvider>
  );
};

export default HomePage;
