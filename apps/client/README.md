# eDistanta Client

The frontend application for eDistanta, built with React, TypeScript, and Vite.

## Overview

This is the client-side application for eDistanta, a comprehensive route planning and fuel price tracking platform for Romania. The application provides an intuitive interface for planning routes, viewing fuel prices, managing favorite routes, and calculating travel costs.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS for modern, responsive design
- **Mapping**: Leaflet with OpenStreetMap integration
- **Routing**: OSRM (Open Source Routing Machine) API
- **State Management**: React Context API
- **Internationalization**: i18next for English and Romanian support
- **Animations**: Framer Motion for smooth UI transitions

## Features

### Core Functionality

- **Interactive Route Planning**: Calculate routes between Romanian cities with real-time visualization
- **Multi-Stop Routes**: Add unlimited waypoints between start and destination
- **Alternative Routes**: View and compare multiple route options
- **Favorite Routes**: Save frequently used routes with custom names (anonymous, browser fingerprint-based)
- **Fuel Cost Calculator**: Real-time fuel price integration with consumption estimates
- **Bridge Toll Detection**: Automatic detection and cost calculation for toll bridges
- **Responsive Design**: Fully optimized for desktop and mobile devices
- **Dark/Light Maps**: Toggle between different map styles

### Components Structure

```
src/
├── components/
│   ├── common/              # Reusable components
│   │   ├── AlertBanner.tsx
│   │   ├── ApiStatusBanner.tsx
│   │   ├── ConfirmationModal.tsx
│   │   └── LanguageSelector.tsx
│   ├── features/            # Feature-specific components
│   │   ├── favorites/       # Favorites system
│   │   │   ├── FavoritesList.tsx
│   │   │   ├── FavoritesSection.tsx
│   │   │   └── SaveFavoriteButton.tsx
│   │   ├── map/             # Map components
│   │   │   └── RouteMap.tsx
│   │   ├── route/           # Route planning
│   │   │   ├── RouteAlternatives.tsx
│   │   │   ├── RouteDetails.tsx
│   │   │   └── RouteMetrics.tsx
│   │   ├── search/          # Search components
│   │   │   ├── LocationInput.tsx
│   │   │   ├── SearchComponent.tsx
│   │   │   └── WaypointInput.tsx
│   │   ├── toll/            # Toll information
│   │   │   └── TollInfo.tsx
│   │   └── vehicle/         # Vehicle settings
│   │       └── VehicleSettings.tsx
│   ├── layout/              # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── Header.tsx
│   │   ├── MobileRoutePanel.tsx
│   │   └── Sidebar.tsx
│   └── modals/              # Modal components
│       ├── ProjectInfoModal.tsx
│       ├── TermsAndConditionsModal.tsx
│       └── TollInfoModal.tsx
├── contexts/                # React contexts
│   ├── FavoritesContext.tsx
│   └── RouteDetailsContext.tsx
├── hooks/                   # Custom React hooks
│   ├── useLocationSearch.ts
│   └── useWaypoints.ts
├── i18n/                    # Internationalization
│   └── i18n.ts
├── services/                # API services
│   ├── favoritesService.ts
│   ├── fuelPriceService.ts
│   ├── locationService.ts
│   ├── routeService.ts
│   └── tollService.ts
├── types/                   # TypeScript types
│   └── location.ts
└── utils/                   # Utility functions
    └── fingerprint.ts
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 10 or higher

### Installation

1. Install dependencies from the project root:

```sh
npm install
```

2. Create environment file:

```sh
# Create .env file in apps/client/
cp .env.example .env
```

3. Configure environment variables:

```env
VITE_API_URL=http://localhost:9001
```

### Development

Start the development server:

```sh
# From project root
npm run dev:client

# Or from apps/client directory
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```sh
# From project root
npm run build:client

# Or from apps/client directory
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```sh
npm run preview
```

## Key Features Implementation

### 1. Favorites System

The favorites system uses browser fingerprinting for anonymous user identification:

- **Browser Fingerprint**: Generated using canvas fingerprinting and device characteristics
- **Local Storage**: Fingerprint cached in localStorage for consistency
- **CRUD Operations**: Full create, read, update, delete functionality
- **Custom Names**: Optional route naming with inline editing
- **Confirmation Modal**: Reusable confirmation dialog for destructive actions

### 2. Route Planning

Advanced route planning with multiple features:

- **Location Search**: Autocomplete search for Romanian cities and towns
- **Waypoints**: Add/remove/reorder intermediate stops with drag-and-drop
- **Route Alternatives**: Compare up to 3 alternative routes
- **Real-time Visualization**: Interactive map with route overlay
- **URL State Management**: Share routes via URL parameters

### 3. Fuel Cost Calculator

Integrated fuel price tracking and cost estimation:

- **Real-time Prices**: Live fuel prices from Romanian gas stations
- **Vehicle Types**: Support for cars, buses, and minibuses
- **Custom Consumption**: User-defined fuel consumption rates
- **CO₂ Emissions**: Environmental impact calculation
- **Price Comparison**: Compare costs across different fuel types

### 4. Internationalization

Full bilingual support:

- **Languages**: English and Romanian
- **Auto-detection**: Browser language detection
- **Persistent Selection**: Language preference saved in localStorage
- **Dynamic Switching**: Real-time language switching without page reload

## Code Quality

### TypeScript

- **Strict Mode**: Full TypeScript strict mode enabled
- **Type Safety**: Comprehensive type definitions for all APIs
- **Interface Definitions**: Strong typing for components and services

### ESLint Configuration

The project uses TypeScript ESLint with React-specific rules. To enable type-aware linting:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

## Performance Optimizations

- **Code Splitting**: Route-based code splitting for faster initial load
- **Lazy Loading**: Components loaded on-demand
- **Memoization**: React.memo and useMemo for expensive computations
- **Debounced Search**: Search input debouncing to reduce API calls
- **Optimized Images**: Image optimization and lazy loading

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Environment Variables

```env
# API Base URL
VITE_API_URL=http://localhost:9001

# Map Configuration (Optional)
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_ATTRIBUTION=© OpenStreetMap contributors
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. You can also specify a custom port:

```sh
npm run dev -- --port 3000
```

### API Connection Issues

Ensure the backend API is running on the configured `VITE_API_URL`. Check the browser console for CORS errors.

### Build Failures

Clear the Vite cache and node_modules:

```sh
rm -rf node_modules .vite dist
npm install
npm run build
```

## Contributing

When contributing to the client application:

1. Follow the existing component structure
2. Add TypeScript types for all new components/functions
3. Include translations for both English and Romanian
4. Test on both desktop and mobile viewports
5. Ensure accessibility standards (ARIA labels, keyboard navigation)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
