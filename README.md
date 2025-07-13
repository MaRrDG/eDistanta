# eDistanta - Modern Route Planning & Fuel Price Tracking for Romania

![eDistanta](https://img.shields.io/badge/Info%20Rutier-v1.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Turborepo](https://img.shields.io/badge/Turborepo-2.5-4353FF?logo=turborepo)
![License](https://img.shields.io/badge/License-MIT-green)

eDistanta is a comprehensive web application for route planning and fuel price tracking in Romania.
It combines intuitive route planning with real-time fuel price data to help users make informed
travel decisions.

![eDistanta Screenshot](https://via.placeholder.com/800x450.png?text=Info+Rutier+Screenshot)

## Features

### Route Planning

- **Interactive Route Planning**: Select start and destination cities from a comprehensive list of
  Romanian locations
- **Multiple Route Options**: View and compare alternative routes between destinations
- **Multi-Stop Routes**: Add multiple waypoints between start and destination
- **Detailed Route Information**: Get accurate distance and estimated travel time
- **Fuel Consumption Estimates**: Calculate fuel usage and CO₂ emissions based on vehicle type
- **Interactive Map**: Visualize routes using OpenStreetMap integration

### Fuel Price Tracking

- **Real-Time Fuel Prices**: Automated scraping of current fuel prices from Romanian gas stations
- **Price Comparison**: Compare fuel prices across different stations and locations
- **Historical Data**: Track fuel price trends over time
- **Advanced Filtering**: Search by station, fuel type, location, and price range
- **RESTful API**: Comprehensive API for accessing fuel price data

### User Experience

- **Responsive Design**: Optimized for both desktop and mobile devices
- **Multilingual Support**: Available in English and Romanian
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Mapping**: Leaflet with OpenStreetMap for route visualization
- **Routing**: OSRM (Open Source Routing Machine) API
- **Internationalization**: i18next for multilingual support

### Backend

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with TypeORM
- **Scraping**: Axios and Cheerio for web scraping
- **Scheduling**: Node-cron for automated tasks
- **Security**: Helmet, CORS, and rate limiting

### Development

- **Build System**: Turborepo for monorepo management
- **Language**: TypeScript throughout the stack
- **Architecture**: Modular design with clean separation of concerns

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 10 or higher

### Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/eDistanta.git
cd eDistanta
```

2. Install dependencies:

```sh
npm install
```

3. Set up the database:

```sh
# Create PostgreSQL database
createdb info_rutier

# Copy and configure environment variables
cp apps/api/env.example apps/api/.env
# Edit apps/api/.env with your database credentials
```

4. Start the development servers:

```sh
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:client  # Frontend at http://localhost:5173
npm run dev:api     # Backend at http://localhost:3001
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
eDistanta/
├── apps/
│   ├── client/         # React frontend application
│   │   ├── public/     # Static assets
│   │   └── src/        # Source code
│   │       ├── components/  # React components
│   │       ├── services/    # API services
│   │       ├── hooks/       # Custom React hooks
│   │       ├── i18n/        # Internationalization
│   │       └── types/       # TypeScript types
│   └── api/            # Express.js backend API
│       └── src/        # Source code
│           ├── config/      # Configuration files
│           ├── controllers/ # Request handlers
│           ├── entities/    # Database models
│           ├── scrapers/    # Web scraping modules
│           ├── services/    # Business logic
│           ├── types/       # TypeScript interfaces
│           └── routes/      # API routes
└── packages/           # Shared packages (future expansion)
```

## Available APIs

### Fuel Price API

The application provides a comprehensive RESTful API for accessing fuel price data:

- **GET** `/api/fuel-prices` - Get all fuel prices with filtering and pagination
- **GET** `/api/fuel-prices/latest` - Get latest prices for each station
- **GET** `/api/fuel-prices/station/:name` - Get prices for specific station
- **POST** `/api/fuel-prices/scrape` - Trigger manual price scraping
- **GET** `/api/fuel-prices/scrape/status` - Get scraping status

For detailed API documentation, see [`apps/api/README.md`](apps/api/README.md).

## Roadmap

Here are the planned features and improvements for future releases:

1. ✅ **Multi-Stop Route Planning** [Implemented]: Add functionality to include multiple waypoints
   between start and destination
2. ✅ **Real-Time Fuel Price Integration** [Implemented]: Automated scraping of current fuel prices
   from Romanian gas stations
3. **Enhanced Fuel Price Sources**: Add more fuel price websites and improve data accuracy
4. **Route Optimization**: Integrate fuel prices with route planning for cost-effective travel
5. **Public API**: Create a public API allowing developers to access route information and
   calculations
6. **Mobile App**: Develop native mobile applications for iOS and Android
7. **Monetization**: Integrate Google Ads for sustainable project development
8. ✅ **Expanded Location Coverage** [Implemented]: Ensure all localities in Romania and Moldova are
   available in the application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Development

### Running Tests

```sh
# Run all tests
npm test

# Run tests for specific app
npm run test:client
npm run test:api
```

### Building for Production

```sh
# Build all apps
npm run build

# Build specific app
npm run build:client
npm run build:api
```

### Code Quality

```sh
# Lint all code
npm run lint

# Format code
npm run format
```

## Acknowledgements

- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [OSRM](http://project-osrm.org/) for routing services
- [Leaflet](https://leafletjs.com/) for interactive maps
- [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/) for the frontend
  framework
- [Express.js](https://expressjs.com/) for the backend framework
- [PostgreSQL](https://www.postgresql.org/) for the database
- [TypeORM](https://typeorm.io/) for database management
