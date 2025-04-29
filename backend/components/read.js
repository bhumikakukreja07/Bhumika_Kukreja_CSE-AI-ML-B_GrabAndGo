// components/read.js
const { Client } = require('pg');

const connParams = {
  host: '192.168.1.201',
  port: 5432,
  database: 'food_db', 
  user: 'bhumika',     
  password: 'grab_and_go'    
};

async function return_row_from_the___specific_cell_of_the_column(cell, table_name, column_name) {
  const client = new Client(connParams);

  try {
    await client.connect();

    const selectQuery = `
      SELECT * FROM ${table_name}
      WHERE ${column_name} = $1
      ORDER BY id DESC
      LIMIT 1;
    `;
    const values = [cell];

    const res = await client.query(selectQuery, values);

    // If a matching row is found, return the whole row; otherwise return null.
    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error reading OTP:', error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = { return_row_from_the___specific_cell_of_the_column };