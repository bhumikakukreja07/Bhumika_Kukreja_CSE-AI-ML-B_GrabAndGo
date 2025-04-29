// components/cart.js
const { Client } = require('pg');

const connParams = {
  host: '192.168.1.201',
  port: 5432,
  database: 'food_db', 
  user: 'bhumika',     
  password: 'grab_and_go'    
};

/**
 * Modifies the cart based on the action type.
 *
 * @param {string} user_email — email of the user
 * @param {number} user_id    — unique user id
 * @param {number} item_id    — item being added or deleted
 * @param {string} action     — 'add' or 'delete'
 */
async function modifyCart(user_email, user_id, item_id, action) {
  const client = new Client(connParams);
  await client.connect();

  try {
    const checkQuery = `
      SELECT quantity
      FROM cart
      WHERE user_email = $1 AND user_id = $2 AND item_id = $3
      LIMIT 1;
    `;
    const checkRes = await client.query(checkQuery, [user_email, user_id, item_id]);

    if (action === 'add') {
      if (checkRes.rowCount > 0) {
        const newQuantity = checkRes.rows[0].quantity + 1;

        const updateQuery = `
          UPDATE cart
          SET quantity = $1
          WHERE user_email = $2 AND user_id = $3 AND item_id = $4
          RETURNING user_email, user_id, item_id, quantity;
        `;
        const updateRes = await client.query(updateQuery, [
          newQuantity,
          user_email,
          user_id,
          item_id
        ]);

        return {
          success: true,
          updated: updateRes.rows[0],
          message: 'Quantity incremented'
        };
      }

      const insertQuery = `
        INSERT INTO cart (user_email, user_id, item_id, quantity)
        VALUES ($1, $2, $3, 1)
        RETURNING user_email, user_id, item_id, quantity;
      `;
      const insertRes = await client.query(insertQuery, [
        user_email,
        user_id,
        item_id
      ]);

      return {
        success: true,
        inserted: insertRes.rows[0],
        message: 'Item added to cart'
      };

    } else if (action === 'delete') {
      if (checkRes.rowCount === 0) {
        return {
          success: false,
          message: 'Item not found in cart'
        };
      }

      const currentQty = checkRes.rows[0].quantity;
      if (currentQty > 1) {
        const updateQuery = `
          UPDATE cart
          SET quantity = $1
          WHERE user_email = $2 AND user_id = $3 AND item_id = $4
          RETURNING user_email, user_id, item_id, quantity;
        `;
        const updateRes = await client.query(updateQuery, [
          currentQty - 1,
          user_email,
          user_id,
          item_id
        ]);

        return {
          success: true,
          updated: updateRes.rows[0],
          message: 'Quantity decremented'
        };
      } else {
        const deleteQuery = `
          DELETE FROM cart
          WHERE user_email = $1 AND user_id = $2 AND item_id = $3
          RETURNING user_email, user_id, item_id;
        `;
        const deleteRes = await client.query(deleteQuery, [
          user_email,
          user_id,
          item_id
        ]);

        return {
          success: true,
          deleted: deleteRes.rows[0],
          message: 'Item removed from cart'
        };
      }
    } else {
      return {
        success: false,
        message: 'Invalid action. Use "add" or "delete".'
      };
    }

  } catch (error) {
    console.error('Error modifying cart:', error);
    return { success: false, error: error.message };
  } finally {
    await client.end();
  }
}

async function getCartQuantity(user_email, user_id, item_id) {
  const client = new Client(connParams);
  await client.connect();
  try {
    const res = await client.query(
      `SELECT quantity FROM cart WHERE user_email=$1 AND user_id=$2 AND item_id=$3`,
      [user_email, user_id, item_id]
    );
    return res.rowCount ? res.rows[0].quantity : 0;
  } finally {
    await client.end();
  }
}

/**
 * Retrieves all cart items for a given user.
 *
 * @param {number} user_id    — unique user id
 * @returns {Array<Object>} rows matching the user
 */
async function getCartItems(user_id) {
  const client = new Client(connParams);
  await client.connect();
  try {
    const query = `
    SELECT user_email, user_id, item_id, quantity
    FROM cart
    WHERE user_id=$1
    ORDER BY quantity DESC
  `;
  
    const res = await client.query(query, [user_id]);
    return res.rows;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = { modifyCart, getCartQuantity, getCartItems };