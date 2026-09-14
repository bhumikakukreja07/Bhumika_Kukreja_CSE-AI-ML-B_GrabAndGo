require('dotenv').config();

// Centralized DB connection config. Falls back to the local dev defaults
// so nothing breaks for anyone still running Postgres on localhost.
const connParams = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'food_db',
      user: process.env.DB_USER || 'bhumika',
      password: process.env.DB_PASSWORD || 'grab_and_go'
    };

module.exports = { connParams };
