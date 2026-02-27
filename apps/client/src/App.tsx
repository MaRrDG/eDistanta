import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './ui/pages/HomePage';
import RoutePage from './ui/pages/RoutePage';
import NotFoundPage from './ui/components/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ruta/:routeSlug" element={<RoutePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;