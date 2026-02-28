# eDistanta API - Agent Context

This document provides context for AI agents working on the `apps/api` codebase.

## 🏗️ Architecture: Hexagonal (Ports and Adapters)

The API is structured following Hexagonal Architecture principles to decouple business logic from external concerns (database, web framework, external services).

### Layer Hierarchy
1.  **Core (Domain & Application)**:
    *   `src/core/domain/`: Contains purely business entities and logic. It should have NO dependencies on other layers.
        *   `entities/`: Domain models (FuelPrice, UserFavorite, RouteSearch).
        *   `ports/`: Interfaces for outbound adapters (Repositories, Scrapers).
        *   `types/`: Shared domain types (Scraper interfaces, DTOs).
    *   `src/core/application/`: Contains use cases that orchestrate domain logic and call port interfaces.
        *   `use-cases/`: Specific business processes (Scraping, Fetching prices).
2.  **Infrastructure**:
    *   `src/infrastructure/`: Concrete implementations of domain ports and system configuration.
        *   `persistence/`: TypeORM repository implementations.
        *   `adapters/scrapers/`: Scraper implementations (PecoOnlineScraper).
        *   `adapters/cron/`: Schedulers (Driving adapters).
        *   `config/`: System configuration (Database, Logger, etc.).
3.  **Web Layer**:
    *   `src/web/`: Express.js adapters.
        *   `controllers/`: Handle HTTP requests and call application use cases.
        *   `routes/`: Define API endpoints and mount controllers.
        *   `middleware/`: Express middleware.

## 🛠️ Key Technologies
*   **Node.js & TypeScript**
*   **Express.js**: Web framework.
*   **TypeORM**: Data persistence (PostgreSQL).
*   **Axios & Cheerio**: For scraping logic.
*   **node-cron**: For scheduled tasks.
*   **tsconfig-paths**: For path alias resolution at runtime.
*   **Swagger (swagger-jsdoc & swagger-ui-express)**: For automatic API documentation at `/api/v1/docs`.

## 🔌 Dependency Injection
The project uses **Constructor Injection** for all dependencies. The **Composition Root** is located in `src/index.ts` within the `bootstrap()` function.

*   Repositories are injected into Use Cases.
*   Use Cases are injected into Controllers and Schedulers.

## 🚀 Common Tasks
*   **Adding a new Entity**: Add to `src/core/domain/entities/`, update `AppDataSource` in `src/infrastructure/config/database.ts`.
*   **Adding a new Use Case**: Create in `src/core/application/use-cases/`.
*   **Adding a new API endpoint**: Create or update controller in `src/web/controllers/`, add to routes in `src/web/routes/v1/`, and update wiring in `src/index.ts`.
*   **Adding a new Scraper**: Implement `IScraper` in `src/infrastructure/adapters/scrapers/` and add to `scrapeFuelPricesUseCase` in `src/index.ts`.

## 📜 Coding Standards
*   Business rules must stay in `domain/` or `application/`.
*   Controllers should be thin and only handle request validation and response formatting.
*   Use path aliases: `@domain`, `@application`, `@infrastructure`, `@web`, `@controllers`, `@app-types`, `@config`, `@middleware`.
