# eDistanta - Modern Route Planning for Romania

![eDistanta](https://img.shields.io/badge/eDistanta-v1.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Turborepo](https://img.shields.io/badge/Turborepo-2.5-4353FF?logo=turborepo)
![License](https://img.shields.io/badge/License-MIT-green)

eDistanta is a modern, responsive web application for planning routes within Romania. It provides an intuitive interface for calculating distances between cities, estimating travel times, and visualizing routes on an interactive map.

![eDistanta Screenshot](https://via.placeholder.com/800x450.png?text=eDistanta+Screenshot)

## Features

- **Interactive Route Planning**: Select start and destination cities from a comprehensive list of Romanian locations
- **Multiple Route Options**: View and compare alternative routes between destinations
- **Detailed Route Information**: Get accurate distance and estimated travel time
- **Fuel Consumption Estimates**: Calculate fuel usage and CO₂ emissions based on vehicle type
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Multilingual Support**: Available in English and Romanian
- **Interactive Map**: Visualize routes using OpenStreetMap integration

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Mapping**: Leaflet with OpenStreetMap for route visualization
- **Routing**: OSRM (Open Source Routing Machine) API
- **Internationalization**: i18next for multilingual support
- **Build System**: Turborepo for monorepo management

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 10 or higher

### Installation

1. Clone the repository:
```sh
git clone https://github.com/yourusername/edistanta.git
cd edistanta
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
edistanta/
├── apps/
│   └── client/         # React frontend application
│       ├── public/     # Static assets
│       └── src/        # Source code
│           ├── components/  # React components
│           ├── i18n/        # Internationalization
│           └── assets/      # Images and other assets
└── packages/           # Shared packages (future expansion)
```

## Roadmap

Here are the planned features and improvements for future releases:

1. **Multi-Stop Route Planning**: Add functionality to include multiple waypoints between start and destination
2. **Real-Time Fuel Price Integration**: Develop a scraper to fetch current fuel prices from Romanian gas stations
3. **Public API**: Create a public API allowing developers to access route information and calculations
4. **Monetization**: Integrate Google Ads for sustainable project development

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [OSRM](http://project-osrm.org/) for routing services
- [Leaflet](https://leafletjs.com/) for interactive maps
- [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/) for the frontend framework
