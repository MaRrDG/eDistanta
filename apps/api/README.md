# Info Rutier API

Express API for fuel price scraping and management with PostgreSQL database using TypeORM.

## Features

- 🔄 **Automated Scraping**: Scheduled fuel price scraping at 10:00 AM daily
- 🗄️ **PostgreSQL Database**: Using TypeORM for robust data management
- 📊 **Comprehensive API**: RESTful endpoints for fuel price data
- 🔍 **Advanced Filtering**: Search by station, fuel type, location, price range, and date
- 📈 **Statistics**: Get price statistics and trends
- 🔐 **Security**: Rate limiting, CORS, and helmet protection
- 📝 **Logging**: Structured logging with Winston
- 🚀 **TypeScript**: Full TypeScript support with strict typing
- 🏗️ **Modular Architecture**: Clean separation of concerns with dedicated services and scrapers

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=info_rutier
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # Scraping
   SCRAPING_ENABLED=true
   SCRAPING_CRON_SCHEDULE=0 10 * * *
   
   # Server
   PORT=3001
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Set up PostgreSQL database**:
   ```sql
   CREATE DATABASE info_rutier;
   ```

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Project Structure

```
src/
├── config/
│   ├── database.ts          # Database configuration
│   └── scraper.ts           # Scraper configuration constants
├── controllers/
│   └── FuelPriceController.ts # API route handlers
├── entities/
│   └── FuelPrice.ts         # TypeORM entity definitions
├── scrapers/
│   └── PecoOnlineScraper.ts # Individual scraper implementations
├── services/
│   ├── ScraperService.ts    # Main scraping orchestration
│   └── FuelPriceQueryService.ts # Database query logic
├── types/
│   └── scraper.ts           # TypeScript interfaces and types
├── routes/
│   └── FuelPriceRoutes.ts   # API route definitions
└── index.ts                 # Application entry point
```

### Architecture Overview

The API follows a modular architecture with clear separation of concerns:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and orchestration
- **Scrapers**: Individual scraper implementations for different websites
- **Types**: Centralized TypeScript interfaces and type definitions
- **Config**: Configuration constants and settings
- **Entities**: Database models and schema definitions

## API Endpoints

### Fuel Prices

#### GET `/api/fuel-prices`
Get all fuel prices with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `stationName` (string): Filter by station name
- `fuelType` (string): Filter by fuel type
- `location` (string): Filter by location
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `dateFrom` (string): Start date (ISO format)
- `dateTo` (string): End date (ISO format)
- `sortBy` (string): Sort field (default: 'scrapedAt')
- `sortOrder` (string): Sort order 'ASC' or 'DESC' (default: 'DESC')

**Example:**
```bash
GET /api/fuel-prices?fuelType=Benzina&location=Bucuresti&page=1&limit=20
```

#### GET `/api/fuel-prices/latest`
Get the latest fuel prices for each station and fuel type.

**Query Parameters:**
- `fuelType` (string): Filter by fuel type
- `location` (string): Filter by location

#### GET `/api/fuel-prices/station/:stationName`
Get fuel prices for a specific station.

**Query Parameters:**
- `fuelType` (string): Filter by fuel type
- `limit` (number): Number of results (default: 10)

#### GET `/api/fuel-prices/stats`
Get fuel price statistics.

**Query Parameters:**
- `fuelType` (string): Filter by fuel type
- `location` (string): Filter by location
- `days` (number): Number of days to analyze (default: 30)

#### GET `/api/fuel-prices/types`
Get all available fuel types.

#### GET `/api/fuel-prices/locations`
Get all available locations.

### Scraping

#### POST `/api/fuel-prices/scrape`
Trigger manual fuel price scraping.

#### GET `/api/fuel-prices/scrape/status`
Get current scraping status.

### System

#### GET `/health`
Health check endpoint.

#### GET `/`
API information and available endpoints.

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "totalPages": 20
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Database Schema

### fuel_prices table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| station_name | VARCHAR(255) | Gas station name |
| fuel_type | VARCHAR(50) | Type of fuel (Benzina, Motorina, etc.) |
| price | DECIMAL(10,3) | Price per liter |
| currency | VARCHAR(3) | Currency code (default: RON) |
| location | VARCHAR(255) | City or location |
| address | TEXT | Full address |
| latitude | DECIMAL(10,8) | GPS latitude |
| longitude | DECIMAL(11,8) | GPS longitude |
| scraped_at | TIMESTAMP | When data was scraped |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

## Scraping Configuration

The scraper supports multiple fuel price websites and can be configured through environment variables:

- `SCRAPING_ENABLED`: Enable/disable automatic scraping
- `SCRAPING_CRON_SCHEDULE`: Cron expression for scheduling (default: "0 10 * * *" - 10:00 AM daily)

### Supported Websites

Currently implemented scrapers:
- **PECO Online**: Romanian fuel price aggregator

### Adding New Scrapers

To add a new scraper:

1. Create a new scraper class in `src/scrapers/` implementing the scraper interface:
   ```typescript
   export class NewScraper {
     async scrape(): Promise<ScrapedFuelPrice[]> {
       // Implementation
     }
   }
   ```

2. Add the scraper to the `ScraperService` in `src/services/ScraperService.ts`:
   ```typescript
   private scrapers = [
     new PecoOnlineScraper(),
     new NewScraper() // Add your scraper here
   ];
   ```

3. Configure scraper-specific constants in `src/config/scraper.ts`

### Configuration Constants

All scraper configuration is centralized in `src/config/scraper.ts`:
- `SCRAPER_CONFIG`: General scraping settings
- `PECO_ONLINE_CONFIG`: PECO Online specific configuration
- `QUERY_DEFAULTS`: Default query parameters

## Logging

Logs are written to:
- Console (development)
- `logs/app.log` (application logs)
- `logs/exceptions.log` (unhandled exceptions)
- `logs/rejections.log` (unhandled promise rejections)

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable origin restrictions
- **Helmet**: Security headers
- **Input Validation**: Using class-validator
- **SQL Injection Protection**: TypeORM parameterized queries

## Frontend Integration

To use this API with your frontend (React app at `http://localhost:5173`):

```javascript
// Get latest fuel prices
const response = await fetch('http://localhost:3001/api/fuel-prices/latest');
const data = await response.json();

// Get fuel prices with filters
const filtered = await fetch('http://localhost:3001/api/fuel-prices?fuelType=Benzina&location=Bucuresti');
const fuelPrices = await filtered.json();
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up proper logging directory
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure monitoring and alerting

## Development Guidelines

### Code Organization

- **Separation of Concerns**: Each module has a single responsibility
- **Type Safety**: Use TypeScript interfaces from `src/types/`
- **Configuration**: Store constants in `src/config/`
- **Error Handling**: Consistent error handling across all modules
- **Logging**: Use structured logging for debugging and monitoring

### Adding New Features

1. **New API Endpoints**: Add to controllers and update routes
2. **New Scrapers**: Follow the scraper interface pattern
3. **Database Changes**: Update entities and migrations
4. **Configuration**: Add new constants to config files
5. **Types**: Define interfaces in the types directory

### Testing

- Unit tests for individual scrapers
- Integration tests for API endpoints
- Database tests for query services
- Mock external dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the established architecture patterns
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

## License

This project is licensed under the ISC License. 