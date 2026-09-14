const { Client } = require('pg');
const { connParams } = require('./db_config');

async function getCartWithPrices(user_id) {
  const client = new Client(connParams);
  try {
    await client.connect();
    const res = await client.query(
      `SELECT c.item_id, c.quantity, i.title, i.price
       FROM cart c JOIN items_list i ON i.id = c.item_id
       WHERE c.user_id = $1`,
      [user_id]
    );
    return res.rows;
  } finally {
    await client.end();
  }
}

async function createOrderRecord(user_email, user_id, items, totalAmount, razorpayOrderId) {
  const client = new Client(connParams);
  try {
    await client.connect();
    const res = await client.query(
      `INSERT INTO orders (user_email, user_id, items, total_amount, razorpay_order_id, status)
       VALUES ($1, $2, $3, $4, $5, 'created')
       RETURNING *`,
      [user_email, user_id, JSON.stringify(items), totalAmount, razorpayOrderId]
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

async function markOrderPaid(razorpayOrderId, razorpayPaymentId) {
  const client = new Client(connParams);
  try {
    await client.connect();
    const res = await client.query(
      `UPDATE orders SET status = 'paid', razorpay_payment_id = $1
       WHERE razorpay_order_id = $2 RETURNING *`,
      [razorpayPaymentId, razorpayOrderId]
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

async function clearCart(user_id) {
  const client = new Client(connParams);
  try {
    await client.connect();
    await client.query(`DELETE FROM cart WHERE user_id = $1`, [user_id]);
  } finally {
    await client.end();
  }
}

module.exports = { getCartWithPrices, createOrderRecord, markOrderPaid, clearCart };
