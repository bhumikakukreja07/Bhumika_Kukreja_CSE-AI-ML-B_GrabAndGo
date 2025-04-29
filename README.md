# Bhumika_Kukreja_CSE-AI-ML-B_GrabAndGo
A project built to simplify the food ordering experience at the K.R. Mangalam University canteen.

# Project Title: Grab&Go

# Team Members
- **Bhumika Kukreja** (Leader) - `2401730163`  
- **Mohini Chauhan** (Member) - `2401730194`  
- **Mishti Jain** (Member) - `2401730162`  
- **Nikki Chauhan** (Member) - `2401730212`

# Project Description

Hungry but stuck in a never-ending canteen queue? Say hello to Grab&Go — your ticket to skipping the line and grabbing a hot meal in seconds!
Grab&Go is a web app that lets you pre-order from multiple cafeterias at once. Built with HTML, CSS, JavaScript and backed by a PostgreSQL database, it handles:

- Passwordless user login via email OTPs

- Order tracking

- Admin dashboard for adding and managing food items easily

- Home page to scroll through delicious food items

# Problem Statement

- Endless Waiting: Students and staff waste precious breaks standing in long cafeteria queues.

- Limited Choice: You can only order from one canteen at a time, missing out on other nearby options.

- No Pre-Order Visibility: Without a unified system, you never know when your meal will actually be ready.

- Manual Menu Management: Cafeteria admins juggle spreadsheets or paper lists to update daily food items, leading to errors and delays.

- Fragmented User Data: Handling OTPs, passwords, and order history across multiple platforms is cumbersome and insecure.

Grab&Go tackles all of these by letting users pre-order from multiple cafeterias, track their meals in real time, and giving admins a single dashboard to manage menus and user data.

# Technologies Used

- Frontend
  - HTML
  - CSS
  - JavaScript
  - GSAP
  
- Backend
  - Node.js – Server-side JavaScript runtime for building the backend.

  - Express – Fast, minimal web framework for routing and middleware.

  - SMTP – Email protocol used for sending OTPs via services like Nodemailer.

  - Chalk – Terminal string styling for colorful, readable console logs.

  - Psycopg – PostgreSQL adapter (optional) for managing database connections and queries.

# How to Run the Project

### 1. Clone & Install
```bash
git clone https://github.com/bhumikakukreja07/Bhumika_Kukreja_CSE-AI-ML-B_GrabAndGo.git
cd your-repo
npm install
```

# Current Working Model

### User Flow
1. **Email Entry & Verification**  
   - User enters their email on the login page.  
   - An OTP is sent to the provided email.  
   - If the OTP is correct, the user is logged in; otherwise, they continue as a guest.

2. **Browsing & Cart Management**  
   - On `grid_page.html`, users can browse and add items to their cart.  
   - Item quantities are updated in the PostgreSQL database in real time.  
   - Updates are reflected immediately on both the `grid_page.html` and `cart_page.html`.

### Admin Flow
- **Item Management**  
  - Admins can upload new food items, specifying:  
    - Name  
    - Price  
    - Description  
    - Canteen/location  
  - Uploaded items become instantly available for users to view and order.
