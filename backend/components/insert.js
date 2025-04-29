// components/insert.js
const { Client } = require('pg');

const connParams = {
  host: '192.168.1.201',
  port: 5432,
  database: 'food_db', 
  user: 'bhumika',     
  password: 'grab_and_go'    
};

/**
 * Insert a row or, if uniqueColumn already exists, update updateColumn.
 *
 * @param {string} tableName        - Name of the table.
 * @param {Array<string>} columns   - Array of column names (excluding id).
 * @param {Array<any>} values       - Array of values matching `columns`.
 * @param {string} uniqueColumn     - Column to check for existence (must be UNIQUE).
 * @param {string} updateColumn     - Column to update if uniqueColumn exists.
 */
async function insertOrUpdateRow(tableName, columns, values, uniqueColumn, updateColumn) {
  console.log('⚡️ insertOrUpdateRow called with', { tableName, uniqueColumn, updateColumn, values });

  const client = new Client(connParams);

  // sanity checks
  if (columns.length !== values.length) {
    return { success: false, message: 'Columns and values count mismatch.' };
  }

  const uniqueIndex = columns.indexOf(uniqueColumn);
  const updateIndex = columns.indexOf(updateColumn);

  if (uniqueIndex === -1 || updateIndex === -1) {
    return {
      success: false,
      message: `You must include both "${uniqueColumn}" and "${updateColumn}" in columns.`
    };
  }

  const uniqueValue = values[uniqueIndex];
  const updateValue = values[updateIndex];

  try {
    await client.connect();
    await client.query('BEGIN');

    // Check if record with uniqueColumn already exists
    const existing = await client.query(
      `SELECT 1 FROM ${tableName} WHERE ${uniqueColumn} = $1`,
      [uniqueValue]
    );

    if (existing.rowCount > 0) {
      // Update existing record
      const result = await client.query(
        `UPDATE ${tableName}
         SET ${updateColumn} = $1
         WHERE ${uniqueColumn} = $2
         RETURNING *;`,
        [updateValue, uniqueValue]
      );

      await client.query('COMMIT');
      console.log(`Updated ${updateColumn} for existing ${uniqueColumn}="${uniqueValue}":`, result.rows[0]);
      return { success: true, updatedRow: result.rows[0] };
    } else {
      // Insert new row
      await client.query(
        `SELECT setval('${tableName}_id_seq', COALESCE((SELECT MAX(id) FROM ${tableName}), 0) + 1, false)`
      );

      const columnsList = columns.join(', ');
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

      const result = await client.query(
        `INSERT INTO ${tableName} (id, ${columnsList})
         VALUES (DEFAULT, ${placeholders})
         RETURNING *;`,
        values
      );

      await client.query('COMMIT');
      console.log('Inserted new row:', result.rows[0]);
      return { success: true, insertedRow: result.rows[0] };
    }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    return { success: false, error: error.message };
  } finally {
    await client.end();
  }
}

module.exports = { insertOrUpdateRow };