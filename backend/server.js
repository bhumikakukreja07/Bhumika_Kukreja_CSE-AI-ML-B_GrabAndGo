// server.js
const express = require('express');
const path = require('path');
const { insertOrUpdateRow } = require('./components/insert'); // Adjust path as necessary
const { insertRowAdminDB } = require('./components/insert_from_admin_dashboard'); // Adjust path as necessary
const { deleteRowByEmail } = require('./components/delete'); // Adjust path as necessary
const { return_row_from_the___specific_cell_of_the_column } = require('./components/read'); // Adjust path as necessary
const { readFromTable } = require('./components/read_table'); // Adjust path as necessary
const { readRows } = require('./components/read_list_of_cards');
const { modifyCart, getCartQuantity, getCartItems } = require('./components/insert_to_cart');
const { sendEmailSMTP } = require('./components/email_sender');
const chalk = require('chalk');
const cors = require('cors');
const app = express();

// enable CORS for all origins (during dev)
app.use(cors());

// your existing middlewares/routes
const port = 5000;


// Middleware to parse JSON bodies
app.use(express.json());


// Route to serve the index file explicitly (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home_page.html'));
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
app.use(express.static(path.join(__dirname, '..', 'frontend')));


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
      let read_the_actual_otp = (obj_obj.otp)
      
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

  let read_the_actual_password = (obj_obj.password)
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
  let read_the_actual_password = (obj_obj.password)

  if (read_the_actual_password === user_entered_password) {
  const qty = await getCartQuantity(user_entered_email, obj_obj.id, item_id);
  res.json({ success: true, quantity: qty });
  }else{
    return res.status(400).json({ success: false, error: 'User not found' });
  }
});


app.post('/get_cart_items', async (req, res) => {
  const { email_name } = req.body;
  const obj = await verify_users(email_name, 'main_user_table', 'email');
  if (obj.id === -1) {
    return res.status(400).json({ success: false, error: 'User not found' });
  }
  const items = await getCartItems(obj.id);              
  res.json({ success: true, items });                   
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
