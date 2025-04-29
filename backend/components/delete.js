// components/delete.js
const { Client } = require('pg');

const connParams = {
  host: '192.168.1.201',
  port: 5432,
  database: 'food_db', 
  user: 'bhumika',
  password: 'grab_and_go'
};

async function deleteRowByEmail(email) {
  const client = new Client(connParams);
  
  try {
    await client.connect();
    await client.query('BEGIN');
    
    const deleteQuery = `
      DELETE FROM user_otp
      WHERE name = $1
      RETURNING *;
    `;
    const values = [email];
    const res = await client.query(deleteQuery, values);

    await client.query('COMMIT');
    
    if (res.rowCount === 0) {
      return { success: false, message: 'No row found with the given email.' };
    }
    
    return { success: true, deletedRow: res.rows[0] };
  } catch (error) {
    await client.query('ROLLBACK');
    return { success: false, error: error.message };
  } finally {
    await client.end();
  }
}

module.exports = { deleteRowByEmail };