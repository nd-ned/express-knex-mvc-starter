require('dotenv').config()

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: process.env.DATABASE_MIGRATIONS_TABLE,
      directory: __dirname + '/database/migrations'
    },
    seeds: {
      directory: __dirname + '/database/seeds'
    },
    debug: false
  },
  production: {
    client: 'mysql',
    connection: {
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: process.env.DATABASE_MIGRATIONS_TABLE,
      directory: __dirname + '/database/migrations'
    },
    debug: false
  }
}
