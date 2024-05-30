# GameLimiter Backend

This is simple MVC starter project built using Node.js and Express, with a PSQL Server database managed through Knex.

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:nd-ned/express-knex-mvc-starter.git
   ```

2. Install dependencies:

   ```bash
   cd express-knex-mvc-starter
   npm install
   ```

3. Set up environment variables:

   Use the provided `.env.example` file as a template to create a `.env` file with the necessary environment variables.

   Make sure to adjust the database connection details as needed.

4. Run migrations:

   ```bash
   npm run migrate:all
   ```

## Usage

- To start the server in development mode with hot reloading:

  ```bash
  npm run dev
  ```

- To start the server in production mode:

  ```bash
  npm start
  ```

## Database Migrations

- `npm run migrate:all`: Runs all database migrations.
- `npm run migrate:up`: Applies pending migrations.
- `npm run migrate:undo`: Rolls back the last migration.
- `npm run migrate:status`: Shows the current status of migrations.
- `npm run migrate:rollback`: Rolls back all migrations.
- `npm run migrate:create`: Creates a new migration file.
- `npm run migrate:refresh`: Rolls back all migrations and then runs all migrations again.
- `npm run generate:secret`: Generates a random string to use as a secret key.
- `npm run generate:keys`: Generates public and private keys for JWT.

## Deployment

This application is containerized using Docker. To build the Docker image, run the following command:

```bash
docker build -t express-knex-mvc-starter .
```

Then, to run the container with environment variables, you need to provide them as arguments to the `docker run` command.
There is an example of how to run the container with environment variables below:

```bash
docker run -e PORT=4200 -e NODE_ENV=development -e JWT_EXPIRATION=36000 -e DATABASE_NAME=your_db -e DATABASE_USER=your_db_user -e DATABASE_PASSWORD=db_password -e DATABASE_SERVER=localhost -e DATABASE_MIGRATIONS_TABLE=migrations -e DATABASE_DEBUG=false -e DEBUG=knex:query -p 4200:4200 express-knex-mvc-starter
```
