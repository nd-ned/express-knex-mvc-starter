require('dotenv').config({ path: '../.env'})
const path = require("path")

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      charset  : 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: process.env.DATABASE_MIGRATIONS_TABLE,
      directory: path.join(__dirname, '../database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds')
    },
    debug: false
  },
  production: {
    client: 'mysql',
    connection: {
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      charset  : 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: process.env.DATABASE_MIGRATIONS_TABLE,
      directory: path.join(__dirname, '../database/migrations')
    },
    debug: false
  }
}
