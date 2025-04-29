// components/insert.js
const { Client } = require('pg');

const connParams = {
  host: '192.168.1.201',
  port: 5432,
  database: 'food_db', 
  user: 'bhumika',    
  password: 'grab_and_go'  
};

async function insertRowAdminDB(tableName, values) {
  const client = new Client(connParams);

  // Expecting 5 values: item_name, price, description, img_path, canteen.
  if (values.length !== 5) {
    return { success: false, message: 'Invalid number of values. Expected 6 values: item_name, price, description, img_path, category and email.' };
  }

  const insertQuery = `
    INSERT INTO ${tableName} (id, title, price, description, img, canteen)
    VALUES (DEFAULT, $1, $2, $3, $4, $5)
    RETURNING *;
  `;

  try {
    await client.connect();
    await client.query('BEGIN');

    // Update the sequence value to be one greater than the current maximum id.
    await client.query(
      `SELECT setval('${tableName}_id_seq', COALESCE((SELECT MAX(id) FROM ${tableName}), 0) + 1, false)`
    );

    const res = await client.query(insertQuery, values);

    await client.query('COMMIT');

    if (res.rowCount === 0) {
      return { success: false, message: 'Insert failed.' };
    }

    console.log("Inserted row:", res.rows[0]);
    return { success: true, insertedRow: res.rows[0] };
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
    }
    return { success: false, error: error.message };
  } finally {
    await client.end();
  }
}

module.exports = { insertRowAdminDB };