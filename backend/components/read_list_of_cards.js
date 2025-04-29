const { Client } = require('pg');

const connParams = {
  host: '192.168.1.201',
  port: 5432,
  database: 'food_db', 
  user: 'bhumika',     
  password: 'grab_and_go'   
};

short_row_counter=0; //global varible

async function readRows(start, numRows) {
  const client = new Client(connParams);

  try {
    await client.connect();

    const selectQuery = `
      SELECT * FROM items_list
      ORDER BY id DESC
      LIMIT $1 OFFSET $2;
    `;
    const values = [numRows, start];

    const res = await client.query(selectQuery, values);

    return res.rows;
  } catch (error) {
    console.error('Error reading rows:', error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = { readRows };