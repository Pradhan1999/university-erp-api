# University ERP API

This project is a backend API for a University ERP system, built with Express.js, TypeScript, and Drizzle ORM.

## Features
- RESTful API built with Express.js
- TypeScript for type safety
- Database access via Drizzle ORM
- Neon serverless PostgreSQL support

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
	```sh
	git clone <repo-url>
	cd university-erp-api
	```
2. Install dependencies:
	```sh
	npm install
	# or
	yarn install
	```

### Environment Setup
Create a `.env` file in the root directory and add your database connection string and other environment variables as needed.

### Database
- Migrations and schema are managed with Drizzle ORM and drizzle-kit.
- To generate and run migrations:
  ```sh
  npm run db:generate
  npm run db:migrate
  ```

### Running the Server
For development:
```sh
npm run dev
```
For production:
```sh
npm run build
npm start
```

## Project Structure
- `src/` - Source code
- `src/server.ts` - Entry point
- `src/db/` - Database setup and schema
- `drizzle/` - Drizzle migration files and metadata

## License
ISC