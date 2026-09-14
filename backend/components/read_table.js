// components/read.js
const { Client } = require('pg');

const { connParams } = require("./db_config");

/**
 * Fetch rows from a PostgreSQL table.
 * @param {string} tableName - Name of the table to query.
 * @param {Array} columns - Optional array of column names to fetch. If not provided, fetches all columns.
 * @returns {Array} - List of rows fetched from the table.
 */
async function readFromTable(tableName, columns = []) {
  const client = new Client(connParams);

  try {
    await client.connect();

    // Determine selected columns or default to *
    const selectedColumns = columns.length > 0 ? columns.join(', ') : '*';

    const selectQuery = `
      SELECT ${selectedColumns}
      FROM ${tableName};
    `;

    const res = await client.query(selectQuery);
    return res.rows;

  } catch (error) {
    console.error(`Error reading from table "${tableName}":`, error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = { readFromTable };
