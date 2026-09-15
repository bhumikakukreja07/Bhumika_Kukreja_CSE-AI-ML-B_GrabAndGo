const { Client } = require('pg');

const { connParams } = require("./db_config");

async function readRows(start, numRows, canteen = null) {
  const client = new Client(connParams);

  try {
    await client.connect();

    const selectQuery = canteen
      ? `SELECT * FROM items_list WHERE canteen = $3 ORDER BY id DESC LIMIT $1 OFFSET $2;`
      : `SELECT * FROM items_list ORDER BY id DESC LIMIT $1 OFFSET $2;`;
    const values = canteen ? [numRows, start, canteen] : [numRows, start];

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
