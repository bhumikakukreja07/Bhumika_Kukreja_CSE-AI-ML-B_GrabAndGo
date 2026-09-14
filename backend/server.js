// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { insertOrUpdateRow } = require('./components/insert'); // Adjust path as necessary
const { insertRowAdminDB } = require('./components/insert_from_admin_dashboard'); // Adjust path as necessary
const { deleteRowByEmail } = require('./components/delete'); // Adjust path as necessary
const { return_row_from_the___specific_cell_of_the_column } = require('./components/read'); // Adjust path as necessary
const { readFromTable } = require('./components/read_table'); // Adjust path as necessary
const { readRows } = require('./components/read_list_of_cards');
const { modifyCart, getCartQuantity, getCartItems } = require('./components/insert_to_cart');
const { sendEmailSMTP } = require('./components/email_sender');
const { getCartWithPrices, createOrderRecord, markOrderPaid, clearCart } = require('./components/order');
const chalk = require('chalk');
const cors = require('cors');
const app = express();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// enable CORS for all origins (during dev)
app.use(cors());

// your existing middlewares/routes
const port = process.env.PORT || 5000;

// which frontend folder this instance serves — lets multiple frontend
// versions (e.g. V2) run off this same backend on a different port
const frontendDir = process.env.FRONTEND_DIR
  ? path.resolve(process.env.FRONTEND_DIR)
  : path.join(__dirname, '..', 'frontend');


// Middleware to parse JSON bodies
app.use(express.json());


// Route to serve the index file explicitly (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'home_page.html'));
});


app.post('/seller_dashboard', async (req, res) => {
  const { item_name, item_price, description, img_path, canteen } = req.body;
  const result = await insertRowAdminDB('items_list', [item_name, item_price, description, img_path, canteen]);
  if(result.success){
    console.log("Data stored in the database successfully");
    res.json({ success: true, message: 'Data received successfully' });
  }
});


// Serve static files from the frontend folder
app.use(express.static(frontendDir));


function getCurrentTime() {
  const now = new Date();

  // Extract hours, minutes, seconds
  const hours   = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}


function isEmail(email) {
  // very simple, but covers most real‑world cases
  const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return re.test(email) ? 1 : 0;
}


// Handle POST request on /login_request endpoint
app.post('/login_request', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(chalk.yellow('Received email:', email));
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    result_ = isEmail(email)

    if(result_ != 1 ){
      return res.json({
        message_from_server: 'email invalid',
      });
    }

    const randomNum = getRandomNumberWithLength(6);
    console.log(chalk.red(`Random 6-digit number: ${randomNum}`));
  
    sendEmailSMTP(
      'grab.and.go.krmu@gmail.com',
      'oipv rmbo iioz zkbe',
      email,
      `Verify your email`,
      `To verify your email address, please use the following One Time Password (OTP): ${randomNum}`,
    )

    // const result = await insertRow('user_otp', [email, randomNum]);
    const result = await insertOrUpdateRow('user_otp', ['name', 'otp'], [email, randomNum], 'name', 'otp');
    console.log('insertRow result:', result);
    
    if (result.success) {
      return res.json({
        message_from_server: 'otp generated successfully',
        email: email,
        id: result.id
      });
    } else {
      // Log the error returned by insertRow
      console.error('insertRow error:', result.error);
      return res.status(500).json({ error: result.error });
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error('Error in /login_request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

  
// Handle POST request on /otp_handler endpoint
app.post('/otp_handler', async (req, res) => {
    const { email ,otp } = req.body;
   
    // Validate email input
    if (!email || !otp) {
      return res.status(400).json({ error: 'both Email and otp is required' });
    }
  

      const obj_obj = await return_row_from_the___specific_cell_of_the_column(email, "user_otp", "name");
      let read_the_actual_otp = obj_obj ? obj_obj.otp : null;
      
      console.log(chalk.magenta(`this is actual otp  :- ${read_the_actual_otp}  of '${email}' email`));
      console.log(chalk.blue(`this is user entered otp  :- ${otp}  of '${email}' email`));
      console.log("")

  if(otp ==  read_the_actual_otp){

    await deleteRowByEmail(email);

    
    big_random_number = getRandomNumberWithLength(20);
     
    const result = await insertOrUpdateRow('main_user_table', ['email', 'password'], [email, big_random_number], 'email', 'password');
    console.log(`Password has been saved internally ${result.password}`)
    console.log(result)

    res.status(200).json({ message_from_server:"success" , email:email , password:big_random_number });// now save this big password to local-storage at cleint side.

  }else{
    res.status(200).json({ message_from_server:"fail" , password:null });
  }

  });

  
async function verify_users(email_data, table_name, column_name){
  const obj_obj = await return_row_from_the___specific_cell_of_the_column(email_data, table_name, column_name);// return row as object
  return obj_obj;
}  


app.post('/verify_login', async (req, res) => {
  const { email, password} = req.body;// this is user entered email and password
  const obj_obj = await verify_users(email, "main_user_table", "email");

  let read_the_actual_password = obj_obj ? obj_obj.password : null;
  console.log(chalk.yellow(`password is verified`));

  console.log(chalk.magenta(`this is actual password  :- ${read_the_actual_password}  of '${email}' email`));
  console.log(chalk.blue(`this is user entered password  :- ${password}  of '${email}' email`));

  if(password ==  read_the_actual_password){
  res.status(200).json({ message_from_server:"success" });

  } else{
    res.status(200).json({ message_from_server:"fail" });
  }
  
});


app.post('/list_of_items', async (req, res) => {
const { list_of_favourate_categories , starting_row , number_of_row } = req.body;

const list_of_objects = await readRows(starting_row , number_of_row); // reads 5 rows from the list_of_card table

    console.log(list_of_objects);
    list_of_relevent_cards = list_of_objects

    res.json(list_of_relevent_cards);
});


app.post('/modify_cart', async (req, res) => {
  const { email_name, item_id, action } = req.body;            // pull `item_id` out of the JSON

    const obj_obj = await verify_users(email_name, "main_user_table", "email");
    console.log("Email:", email_name);

    if (!obj_obj) {
      return res.status(400).send({ success: false, message: "User not found" });
    }

    let user_id = (obj_obj.id)

    console.log(`user_id is ${user_id}`)
    console.log(`item_id is ${item_id}`)

    if(user_id == -1 ) {
      return res.status(400).send({ success: false, message: "User not found" });
    }

    const addResult = await modifyCart(email_name, user_id, item_id, action);

    console.log(`addResult is ${JSON.stringify(addResult, null, 2) }`)
    
    res.send(addResult);
});


app.post('/cart_quantity', async (req, res) => {
  const { user_entered_email,user_entered_password, item_id } = req.body;
  const obj_obj = await verify_users(user_entered_email, 'main_user_table', 'email');
  let read_the_actual_password = obj_obj ? obj_obj.password : null;

  if (obj_obj && read_the_actual_password === user_entered_password) {
  const qty = await getCartQuantity(user_entered_email, obj_obj.id, item_id);
  res.json({ success: true, quantity: qty });
  }else{
    return res.status(400).json({ success: false, error: 'User not found' });
  }
});


app.post('/get_cart_items', async (req, res) => {
  const { email_name } = req.body;
  const obj = await verify_users(email_name, 'main_user_table', 'email');
  if (!obj || obj.id === -1) {
    return res.status(400).json({ success: false, error: 'User not found' });
  }
  const items = await getCartItems(obj.id);
  res.json({ success: true, items });
});


// Creates a Razorpay order for the exact total of the caller's cart,
// computed here from the DB — never trust an amount sent by the client.
app.post('/create_order', async (req, res) => {
  try {
    const { email_name } = req.body;
    const userObj = await verify_users(email_name, 'main_user_table', 'email');
    if (!userObj) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    const cartItems = await getCartWithPrices(userObj.id);
    if (!cartItems.length) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    const totalAmount = cartItems.reduce(
      (sum, row) => sum + parseFloat(row.price) * row.quantity,
      0
    );
    const amountInPaise = Math.round(totalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${userObj.id}_${Date.now()}`
    });

    await createOrderRecord(email_name, userObj.id, cartItems, totalAmount, razorpayOrder.id);

    res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// Verifies the Razorpay payment signature server-side, then marks the
// order paid and clears the cart. Never trust a "success" claimed by the client.
app.post('/verify_payment', async (req, res) => {
  try {
    const { email_name, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userObj = await verify_users(email_name, 'main_user_table', 'email');
    if (!userObj) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Payment verification failed' });
    }

    await markOrderPaid(razorpay_order_id, razorpay_payment_id);
    await clearCart(userObj.id);

    res.json({ success: true, message: 'Payment verified, order placed' });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.post('/read_all_rows_from_table', async (req, res) => {
  const { table_name } = req.body; // pull `id` out of the JSON

    data = await readFromTable(table_name);

    res.json({ 
      one: data 
    });

});


app.post('/get_row_from_table', async (req, res) => {
  const { table_name , item_id } = req.body;            // pull `item_id` out of the JSON
  console.log(table_name);
  console.log(item_id);

    data = await return_row_from_the___specific_cell_of_the_column(item_id, table_name,"id");
    res.json({ 
      row: data 
    });

});  


// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Serving frontend from ${frontendDir}`);
});


// Function to generate a random number with a specific number of digits
function getRandomNumberWithLength(length) {
    if (length <= 0) {
      throw new Error("Length must be a positive integer.");
    }
  
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
