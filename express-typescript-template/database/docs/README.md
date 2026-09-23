# Database Documentation

This directory contains all database-related files including migrations, DDL scripts, and documentation.

## Database Migrations

This project uses [node-pg-migrate](https://www.npmjs.com/package/node-pg-migrate) for database schema management and versioning.

### Migration Files

Migration files are stored in this directory and follow the naming convention:
```
{timestamp}_{description}.js
```

Current migrations:
- `1754899368296_initial-setup.js` - Initial database setup with UUID extension and session storage

### Running Migrations

From the project root directory:

#### Apply Migrations
```bash
# Run all pending migrations
npm run migrate:up

# Run specific number of migrations
npm run migrate up 2
```

#### Rollback Migrations
```bash
# Rollback the last migration
npm run migrate:down

# Rollback specific number of migrations  
npm run migrate down 2
```

#### Create New Migrations
```bash
# Create a new migration file
npm run migrate:create add-users-table

# This will create a new file like: 1754899999999_add-users-table.js
```

### Migration Structure

Each migration file exports two functions:

```javascript
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  // Forward migration - what to apply
  pgm.createTable('example', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}  
 */
exports.down = (pgm) => {
  // Rollback migration - how to undo the up() changes
  pgm.dropTable('example');
};
```

### Configuration

Database connection is configured via:

1. **Environment Variables** (recommended for development):
   ```
   DATABASE_URL=postgresql://username:password@localhost/database_name
   ```

2. **Configuration File** (`.pgmigraterc.json` in project root):
   ```json
   {
     "database-url": "postgresql://localhost/express_ts_db",
     "migrations-dir": "database",
     "migrations-table": "pgmigrations",
     "schema": "public"
   }
   ```

### Best Practices

1. **Always create reversible migrations** - implement both `up()` and `down()` functions
2. **Test migrations** - run up and down migrations to ensure they work correctly
3. **Use descriptive names** - migration names should clearly describe what they do
4. **One logical change per migration** - don't bundle unrelated schema changes
5. **Backup before migrations** - especially in production environments

### Legacy DDL

The `ddl.sql` file contains the original database schema for reference. New changes should be made via migrations rather than modifying this file directly.

## Database Schema

### Current Tables

#### pg_sessions
- **Purpose**: Stores Express.js session data
- **Columns**:
  - `sid` (VARCHAR, PRIMARY KEY): Session identifier  
  - `sess` (JSON): Session data
  - `expire` (TIMESTAMP): Session expiration time

### Extensions

- **uuid-ossp**: Provides UUID generation functions

## Development Workflow

1. **Make schema changes**: Create a new migration instead of modifying existing ones
2. **Test locally**: Run migrations up and down to verify they work
3. **Code review**: Have migrations reviewed like any other code
4. **Deploy**: Run migrations as part of your deployment process

## Troubleshooting

### Common Issues

**Migration fails with "relation already exists"**
- Check if you're trying to create something that already exists
- Use `IF NOT EXISTS` clauses where appropriate
- Verify your down migration properly cleans up

**Cannot rollback migration**
- Ensure your down migration undoes everything the up migration did
- Some operations (like dropping columns with data) may not be safely reversible

**Database connection errors**
- Verify your DATABASE_URL or connection configuration
- Ensure the database exists and is accessible
- Check user permissions

### Getting Help

- [node-pg-migrate Documentation](https://salsita.github.io/node-pg-migrate/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)