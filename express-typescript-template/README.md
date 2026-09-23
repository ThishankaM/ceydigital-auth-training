# Express.js TypeScript Template

This project is a modern Express.js application built with TypeScript, featuring automated builds, database migrations, and comprehensive development tooling.

## Requirements

- Node.js >= 20.0.0
- NPM >= 10.0.0
- PostgreSQL database

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file from `.env.template` and update it
4. Set up your database (see Database Setup section)
5. Run migrations: `npm run migrate:up`
6. Start development: `npm run dev`

## Available Scripts

### Development
- `npm run dev` - Start development server with file watching
- `npm run build:dev` - Build for development
- `npm run watch` - Watch for file changes and rebuild automatically
- `npm start` - Start the production server

### Production
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with minification and compression

### Database Migrations

This project uses [node-pg-migrate](https://www.npmjs.com/package/node-pg-migrate) for database schema management:

- `npm run migrate:up` - Run pending migrations
- `npm run migrate:down` - Rollback the last migration  
- `npm run migrate:create <name>` - Create a new migration file
- `npm run migrate` - Run migrations with custom options

Migration files are stored in the `database/` directory. Configure your database connection via environment variables or the `.pgmigraterc.json` file.

### Testing
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Utilities
- `npm run clean` - Clean the build directory
- `npm run copy` - Copy static files to build directory
- `npm run compile` - Compile TypeScript for production
- `npm run compile:dev` - Compile TypeScript for development
- `npm run sonar` - Run SonarQube analysis

## Project Structure

```
├── src/                    # Source code
│   ├── config/            # Configuration files
│   ├── routes/            # Express routes
│   ├── public/            # Static assets
│   ├── views/             # Pug templates
│   └── tests/             # Test files
├── database/              # Database migrations and schema
├── build/                 # Built application (auto-generated)
└── .env                   # Environment variables
```

## Database Setup

The project uses PostgreSQL with automated migrations. Migration files are stored in the `database/` directory.

### Using Migrations (Recommended)

1. Configure your database connection in `.env` or `.pgmigraterc.json`
2. Run migrations to create the schema:
   ```bash
   npm run migrate:up
   ```

### Creating New Migrations

```bash
npm run migrate:create add-users-table
```

## Development Workflow

1. Make your code changes
2. Create database migrations if needed: `npm run migrate:create <description>`
3. Run tests: `npm test`
4. Build for production: `npm run build`

## Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with node-pg-migrate
- **Template Engine**: Pug
- **Testing**: Jest
- **Security**: Helmet, CSRF protection with csrf-sync
- **Session Management**: express-session with PostgreSQL store
- **Authentication**: Passport.js (Google OAuth2)

## Environment Variables

Copy `.env.template` to `.env` and configure:

- Database connection settings
- Session secrets
- OAuth client credentials
- Other application-specific settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Create a pull request

## License

This project is private and proprietary.